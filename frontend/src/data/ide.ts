export const IDE = {
  moduleLabel: 'Python · Module 3 of 8',
  /** 0–100 */
  moduleProgress: 38,
  profileInitial: 'N',
  badge: 'Challenge 03 · Lists',
  title: 'Find the highest score',
  brief: 'Write a function that accepts a list of player scores and returns the highest value.',
  requirementsTitle: 'Your function should:',
  hint: 'Ask AI for a hint',
  filename: 'solution.py',
  savedLabel: 'All changes saved',
  terminalLabel: 'Terminal',
  runLabel: 'Run code',
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
