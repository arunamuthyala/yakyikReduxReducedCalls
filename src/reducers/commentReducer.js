import constants from '../constants/constants'

var initialState = {
	map : {}
}

export default  (state = initialState, action) => {
	var updated = Object.assign({}, state)
	var updatedMap = Object.assign({}, updated.map)
	switch(action.type){
		case constants.COMMENTS_RECEIVED:
			console.log('COMMENTS_RECEIVED Comments data:->'+JSON.stringify(action.comments))
			let zoneComments = (updatedMap[action.zone._id]) ? Object.assign([], updatedMap[action.zone._id]) : []

			action.comments.forEach((comment,i) => {
				zoneComments.push(comment)
			})

			updatedMap[action.zone._id] = zoneComments
			updated['map'] = updatedMap
			updated['commentsLoaded'] = true
			return updated
		case constants.SELECT_ZONE:
			updated['commentsLoaded'] = false
			return updated
		case constants.COMMENT_CREATED:
			console.log('Inside commentReducer.js:->'+JSON.stringify(action.comment))
			let commentList = updatedMap[action.comment.zone]
			if(commentList==null)
				commentList = []
			else
				commentList = Object.assign([], commentList)
			commentList.push(action.comment)

			updatedMap[action.comment.zone] = commentList
			updated['map'] = updatedMap
			return updated
		default:
			return state
	}
}