// Use the documented Pages REST API with the artifact already verified by the
// workflow. This avoids the separate artifact service returning an empty list.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

export async function publishPages({env=process.env, fetchImpl=fetch, wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}) {
  const artifactId=Number(env.PAGES_ARTIFACT_ID);
  if(!Number.isSafeInteger(artifactId)||artifactId<=0)throw Error('A verified Pages artifact ID is required.');
  for(const key of ['GITHUB_REPOSITORY','GITHUB_SHA','GH_TOKEN','ACTIONS_ID_TOKEN_REQUEST_URL','ACTIONS_ID_TOKEN_REQUEST_TOKEN','GITHUB_OUTPUT']){
    if(!env[key])throw Error('Missing deployment environment field: '+key);
  }
  const base=(env.GITHUB_API_URL||'https://api.github.com')+'/repos/'+env.GITHUB_REPOSITORY;
  const headers={Authorization:'Bearer '+env.GH_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
  async function request(url,options={}){
    const response=await fetchImpl(url,{headers,signal:AbortSignal.timeout(20000),...options});
    if(!response.ok)throw Error('GitHub Pages request failed: HTTP '+response.status);
    return response.json();
  }
  const identityResponse=await fetchImpl(env.ACTIONS_ID_TOKEN_REQUEST_URL,{headers:{Authorization:'Bearer '+env.ACTIONS_ID_TOKEN_REQUEST_TOKEN},signal:AbortSignal.timeout(20000)});
  if(!identityResponse.ok)throw Error('Cannot obtain the workflow identity for Pages publication.');
  const identity=await identityResponse.json();
  if(typeof identity.value!=='string'||!identity.value)throw Error('Workflow identity token is unavailable.');
  const deployment=await request(base+'/pages/deployments',{method:'POST',body:JSON.stringify({artifact_id:artifactId,pages_build_version:env.GITHUB_SHA,oidc_token:identity.value})});
  const deploymentId=deployment.id||deployment.status_url?.split('/').pop();
  if(!deploymentId)throw Error('Pages did not return a deployment ID.');
  const pageUrl=deployment.page_url;
  if(typeof pageUrl!=='string'||!pageUrl.startsWith('https://')||/[\r\n]/.test(pageUrl))throw Error('Pages did not return a valid published URL.');
  fs.appendFileSync(env.GITHUB_OUTPUT,'page_url='+pageUrl+'\n');
  console.log('Pages publication created for the verified website artifact.');
  const deadline=Date.now()+600000;
  const failed=new Set(['deployment_failed','deployment_content_failed','deployment_cancelled','deployment_lost']);
  while(Date.now()<deadline){
    await wait(5000);
    const status=await request(base+'/pages/deployments/'+encodeURIComponent(deploymentId));
    if(status.status==='succeed'){
      fs.appendFileSync(env.GITHUB_OUTPUT,'status=succeed\n');
      console.log('Pages publication succeeded:',pageUrl);
      return pageUrl;
    }
    if(failed.has(status.status))throw Error('Pages publication ended with status '+status.status);
    console.log('Pages publication status:',status.status);
  }
  throw Error('Pages publication did not complete within ten minutes.');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  await publishPages();
}
