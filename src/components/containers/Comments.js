import React, { Component } from 'react'
import { CreateComment, Comment } from '../presentation'
import styles from './styles'
import { APIManager } from '../../utils'
import { connect } from 'react-redux'
import actions from '../../actions/actions'

class Comments extends Component {
	constructor(){
		super()
		this.state = {
		}
	}

	submitComment(comment){
		console.log('submitComment: '+JSON.stringify(comment))
		let updatedComment = Object.assign({}, comment)
		let zone = this.props.zones[this.props.index]
		updatedComment['zone'] = zone._id

		APIManager.post('/api/comment', updatedComment, (err, response) => {
			if (err){
				alert(err)
				return
			}

			const comment = response.results
			this.props.commentCreated(comment)
		})
	}
	componentDidUpdate(){
		console.log('Comments container: componentDidUpdate')
		let zone = this.props.zones[this.props.index]
		if(zone==null){
			console.log('NO SELECTED ZONE!!!')
			return
		}
		console.log('SELECTED ZONE IS READY == '+zone._id)
		let commentsArray = this.props.commentsMap[zone._id]
		console.log('Map == '+JSON.stringify(commentsArray))
		if(commentsArray != null)
				return

		console.log('Comments container: componentDidUpdate, RETRIEVING DATA....')	
		APIManager.get('/api/comment',{zone:zone._id}, (err,response) => {
			if(err){
				alert('ERROR: '+err.message)
				return 
			}
			let comments = response.results
			this.props.commentsReceived(comments,zone)
		})
	}
	render(){
		const selectedZone = this.props.zones[this.props.index]
		console.log('ZONE='+selectedZone)
		let zoneName = null
		let commentList = null
		if(selectedZone!=null) {
			zoneName = selectedZone.name
			let zoneComments = this.props.commentsMap[selectedZone._id]
			if(zoneComments!=null) {
				commentList = zoneComments.map((comment, i) => {
					return (
						<li key={i}><Comment currentComment={comment} /></li>
					)
				})
			}
		}
		return (
			<div>
				<h2>{zoneName}</h2>
				<div style={styles.comment.commentsBox}>
					<ul style={styles.comment.commentsList}>
						{ commentList }
					</ul>

					<CreateComment onCreate={this.submitComment.bind(this)} />
				</div>
			</div>
		)
	}
} 

const stateToProps = (state) => {
	return {
		commentsMap: state.comment.map,
		index: state.zone.selectedZone,
		zones: state.zone.list,
		commentsLoaded: state.comment.commentsLoaded
	}

}
const dispatchToProps = (dispatch) => {
	return {
		commentsReceived: (comments,zone) => dispatch(actions.commentsReceived(comments,zone)),
		commentCreated: (comment) => dispatch(actions.commentCreated(comment))
	}
}
export default connect(stateToProps,dispatchToProps)(Comments)




