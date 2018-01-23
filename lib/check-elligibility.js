module.exports = async function (context) {
  const pullRequest = context.payload.pull_request
  const baseRepoOwner = pullRequest.base.repo.owner
  
  if (baseRepoOwner.type === 'Organization') {
    context.log.debug('PR is for an organization repo, checking if user is member of org')
    const response = await context.github.orgs.checkMembership({org: baseRepoOwner.login, username: pullRequest.user.login})
    if (response.data.state !== 'active' && response.data.state !== 'pending') {
      context.log.debug(`User is not member of org (${response.data.state}), bailing out`)
      return false
    }
  }
  
  return true
}
  