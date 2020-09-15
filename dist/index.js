module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 96:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const github = __webpack_require__(82)
const core = __webpack_require__(105);
const { Octokit } = __webpack_require__(318)
const slack = __webpack_require__(440)(core.getInput('webhook_url'));

const token = core.getInput('github_token')
const octokit = new Octokit({ auth: token })
const repo = github.context.repo

function slackSuccessMessage(source, target, status) {
  return {
      color: "#27ae60",
      icon: ":white_check_mark:",
      message: `${source} was successfully merged into ${target}.`,
      description: `*${target}* can be pushed to production!`
  }
}

function slackErrorMessage(source, target, status) {
  return {
      color: "#C0392A",
      icon: ":red_circle:",
      message: `*${source}* has confilct with *${target}*.`,
      description: ":face_with_head_bandage: Fix me please :pray:"
  }
}

async function slackMessage(source, target, status) {
  if (core.getInput('webhook_url')) {
    const slack = __webpack_require__(440)(core.getInput('webhook_url'));

    let payload = status == 'success' ?
                  slackSuccessMessage(source, target, status) :
                  slackErrorMessage(source, target, status)

    slack.send({
      icon_emoji: payload.icon,
      username: payload.message,
      attachments: [
          {
              author_name: github.context.payload.repository.full_name,
              author_link: `https://github.com/${github.context.payload.repository.full_name}/`,
              title: payload.message,
              text: payload.description,
              color: payload.color,
              fields: [
                  { title: 'Job Status', value: status, short: false },
              ],
          },
      ],
    });
  }
}

async function merge(source, target) {
  core.info(`merge branch:${source} to: ${target}`)

  const today = new Date();
  const month = today.toLocaleString('en-GB', { month: 'long' }).toLowerCase();
  const year = today.toLocaleString('en-GB', { year: 'numeric' });

  const updated_target =
    target === 'automatic'
    ? `${month}-release-${year}`
    : target;

  const response = await octokit.repos.merge({
    owner: repo.owner,
    repo: repo.repo,
    base: updated_target,
    head: source,
    commit_message: `Back merge of code from master`
  })
}

async function run() {
  const source = core.getInput('source')
  const target = core.getInput('target')
  core.info(`merge ${source} into ${target}`)

  try {
    await merge(source, target)
    await slackMessage(source, target, 'success')
  } catch (error) {
    await slackMessage(source, target, 'failure')
    core.setFailed(`${source} merge failed: ${error.message}`)
  }

}

run()


/***/ }),

/***/ 105:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 82:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 318:
/***/ ((module) => {

module.exports = eval("require")("@octokit/rest");


/***/ }),

/***/ 440:
/***/ ((module) => {

module.exports = eval("require")("slack-notify");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(96);
/******/ })()
;