/**
 * First-run gate for the career questionnaire.
 *
 * The Career Path asks the questionnaire once, before it shows the expedition: arriving at
 * `/learn` without an answer redirects there. The flag lives in localStorage, so "first time"
 * means "this browser has never finished it" and survives a reload, a new tab and a restart —
 * unlike the StudyPod call state, which is deliberately per session.
 */
const STORAGE_KEY = 'novacode:questionnaire-completed'

export function hasCompletedQuestionnaire(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'done'
  } catch {
    /* private mode / storage disabled: the questionnaire simply runs again */
    return false
  }
}

export function markQuestionnaireCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'done')
  } catch {
    /* nothing to remember — the gate falls back to asking again next time */
  }
}
