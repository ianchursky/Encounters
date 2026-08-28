/** This returns what status category a particular status string is in, there is probably a better way to do this, but this will do for now.
 * See package.json (./src/package.json) for a list of current statuses. These 2 files should probably be kept in sync.
 * @param statusString A value from the API that is stored in the database.
 * @return string A string that is either 'red,' 'green,' 'orange,' or 'empty' depending on the status. It is used to both sort different lists and applying classes in the DOM for CSS to style.
 */
const getStatusCategory = (statusString) => {
  switch (statusString) {
    case 'Available':
      return 'empty'
    case 'Scheduled':
      return 'empty'
    case 'Bill submitted':
      return 'green'
    case 'Bill pending':
      return 'red'
    case 'Checked In':
      return 'red'
    case 'Not seen':
      return 'empty'
    case 'Cancelled':
      return 'empty'
    case 'Bill audit':
      return 'green'
    case 'Superbill':
      return 'orange'
    case 'Claim provider hold':
      return 'orange'
    case 'Bill rejected':
      return 'orange'
    case 'Bill hold':
      return 'green'
    case 'Completed':
      return 'green'
    case 'Claim assigned':
      return 'green'
    case 'Claim recieved':
      return 'green'
    case 'Claim rejected':
      return 'green'
    case 'Claim denied':
      return 'green'
    case 'Claim accepted':
      return 'green'
    case 'Claim processed':
      return 'green'
    case 'Claim hold':
      return 'green'
    case 'Patient assigned':
      return 'green'
    case 'Patient statement sent':
      return 'green'
    case 'Patient hold':
      return 'green'
    case 'Patient payment':
      return 'green'
    case 'Collections review':
      return 'red'
    case 'Collections assigned':
      return 'red'
    case 'Settled':
      return 'green'
    case 'Void':
      return 'white'
    case 'Last':
      return 'empty'
    case 'Admit':
      return 'red'
    default:
      return 'empty'
  }
}

/** Helper method that will capitalize the first letter in each word of a string e.g. Not yet submitted => Not Yet Submitted
 * @param words a string that is probably in any format (all lower case or all upper case)
 * @return string a formatted string with the first letter of each word capitalized and the rest of the word lowercase
 */
const capitalizeFirstLetterInSentence = (words) => {
  const arr = words.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(' ')
}

/** Small helper method that formulates a string that will be used as part of a CSS class.
 * @param title A string that is used as the label for different categories in the filter e.g. Encounters Status.
 * @return string A string created from the label in a format for being part of a CSS class e.g. "Encounter Status" => "encounter-status."
 */
const createClassStringFromTitle = (title) => {
  if (title.length) {
    return title.split(' ').join('-').toLowerCase()
  } else {
    return ''
  }
}

const getDisplayName = (first, last, title) => {
  return `${capitalizeFirstLetterInSentence(first.toLowerCase())} ${capitalizeFirstLetterInSentence(
    last.toLowerCase(),
  )} ${title}`
}

/**
 * Why must everything be hacky?  Takes in a rendering_provider_name and
 * tries to make it output First (Middle?) Last.
 * Some names can have a comma in it, some can have a DR. or M.D. appendage
 * So we want to remove them
 * @param name the string name
 * @return string name hopefully in first to last order, with no titles
 */
const reorderNameFirstToLastNoTitle = (name) => {
  if (!name) {
    return ''
  }
  let finalName = name.replace(/\bdr\.|\bm\.d\./gi, '')

  if (finalName.includes(',')) {
    const names = finalName.split(',')
    const cleanedParts = names.map((name) => name.trim())
    const [lastName, ...rest] = cleanedParts
    return [...rest, lastName].join(' ')
  } else {
    return finalName.trim()
  }
}

export {
  getStatusCategory,
  createClassStringFromTitle,
  capitalizeFirstLetterInSentence,
  getDisplayName,
  reorderNameFirstToLastNoTitle,
}
