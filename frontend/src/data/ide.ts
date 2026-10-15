export const IDE = {
  moduleLabel: 'Python · Module 3 of 8',
  /** 0–100 */
  moduleProgress: 38,
  profileInitial: 'N',
  badge: 'Challenge 03 · Lists',
  title: 'Find the highest score',
  brief: 'Write a function that accepts a list of player scores and returns the highest value.',
  requirementsTitle: 'Your function should:',
  hint: 'Give Me a hint',
  /** Revealed by the hint button; its body is drawn from the challenge's own material. */
  hintTitle: 'Hint',
  filename: 'solution.py',
  savedLabel: 'All changes saved',
  terminalLabel: 'Terminal',
  runLabel: 'Run code',
  editorLabel: 'Challenge code editor',
  readyMessage: 'Ready. Run your code to see the output.',
  runningMessage: 'Running tests…',
  okMessage: '4 tests passed in 0.12s',
}

export const IDE_REQUIREMENTS = [
  'Accept one list named',
  'Work with negative values',
  'Return one integer',
]

/** The mono token the first requirement highlights. */
export const IDE_REQUIREMENT_TOKEN = 'scores'

export const IDE_EXAMPLE = {
  label: 'Example',
  call: 'highest_score([12, 46, 23])',
  result: '→ 46',
}

export const IDE_CODE = [
  '# Return the highest score in the list',
  'def highest_score(scores):',
  '    highest = scores[0]',
  '    for score in scores:',
  '        if score > highest:',
  '            highest = score',
  '    return highest',
  '',
  'print(highest_score([12, 46, 23]))',
]

/**
 * The challenge's test suite. There is no runner behind it, so the result is DERIVED from the
 * buffer the user actually typed — never from the clock. An empty or half-written solution
 * fails, which is what makes the Run Code button a real control rather than a success animation.
 */
export const IDE_TESTS = {
  total: 4,
  /** How long the simulated run takes before it reports; the result itself is computed at once. */
  runDelay: 900,
} as const

export interface IdeRun {
  message: string
  passed: boolean
  /** `passed / total`, for the screen's status line. */
  score: string
}

/** Pure, so the page only renders the verdict. */
export function runSolution(code: string): IdeRun {
  const source = code.trim()
  if (!source) {
    return { message: 'Nothing to run. Write your function first.', passed: false, score: '0/4' }
  }
  if (!new RegExp(`def\\s+\\w+\\s*\\(\\s*${IDE_REQUIREMENT_TOKEN}\\s*\\)`).test(code)) {
    return {
      message: `2 of ${IDE_TESTS.total} tests failed: the function has to accept one list named ${IDE_REQUIREMENT_TOKEN}.`,
      passed: false,
      score: '2/4',
    }
  }
  if (!/return\s+\w+/.test(code)) {
    return {
      message: `3 of ${IDE_TESTS.total} tests failed: the function never returns the highest score.`,
      passed: false,
      score: '3/4',
    }
  }
  return { message: IDE.okMessage, passed: true, score: '4/4' }
}
