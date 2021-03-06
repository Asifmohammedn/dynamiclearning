import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { Requests} from './requests'
 
export const LessonPlans = new Mongo.Collection('lessonplans')

if(Meteor.isServer) {

    Meteor.publish('lessonplans',function(){
        return LessonPlans.find({userId:this.userId})
    })
}

Meteor.methods({

    'lessonplans.insert'(name) {

        if(!this.userId) {
            throw new Meteor.Error('not-authorized')
        }

        return LessonPlans.insert({
                        
            name,
            slides:[],
            userId:this.userId

        },(err, docs)=>{

            Requests.insert({userId:this.userId, _id:docs, slides:[], requestTitle:''})

        })
    },

    'lessonplans.remove'(_id) {
        LessonPlans.remove(_id)
        Requests.remove(_id)
    },

    'lessonplans.update'(_id, slides) {
        LessonPlans.update(_id, {$set:{slides}})
    }
})

