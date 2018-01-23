module.exports = async function (context) {
  const pullRequest = context.payload.pull_request
  const baseRepoOwner = pullRequest.base.repo.owner
  
  if (baseRepoOwner.type === 'Organization') {
    context.log.debug('PR is for an organization repo, checking if user is member of org')

    try {
      await context.github.orgs.checkMembership({org: baseRepoOwner.login, username: pullRequest.user.login})
    }
    catch (err) {
      context.log.debug(`User is not member of org (${baseRepoOwner.login}), bailing out: ${err}`)
      return false
    }
  }
  
  return true
}
