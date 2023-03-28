import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/compat/firestore';
import { SingleComment } from './single-comment.model';
import { AngularFireDatabase, AngularFireList, SnapshotAction} from '@angular/fire/compat/database';
import { from, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat/app';
import { map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// export class CommentsService {
  
//   private dbPath = '/';

//   commentsRef: AngularFireList<SingleComment>;

//   constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private activatedRoute: ActivatedRoute) { 
//     this.commentsRef = db.list(this.dbPath);
    
//   }

//   getAll(): AngularFireList<SingleComment> {
//     return this.commentsRef;
//   }

//   getSingleComment(comment:string): AngularFireList<SingleComment> {
//     // console.log('this.commentsRef', this.commentsRef);
//     return this.commentsRef;
//   } 

//   create(comment: SingleComment): any {
//     return this.commentsRef.push(comment);
//   }

//   // getAll2(): Observable<SingleComment[]>{  
//   //   return this.afs.collection<SingleComment>('/').valueChanges<string>({idField: 'id'});
//   // }
 
// }
export class CommentsService {
  
  private dbPath = '/';
  commentsRef: AngularFireList<SingleComment>;

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private activatedRoute: ActivatedRoute) { 
    this.commentsRef = db.list(this.dbPath);    
  }

  getCommentsForMatch(matchId: string, underscore:string): AngularFireList<SingleComment> {
    return this.db.list(`postComments${matchId}/${underscore}`);
  }

  

  // getCommentsForMatch2(): AngularFireList<SingleComment> {
  //   return this.db.list(`postComments${m}`);
  // }

  // getNumberOfCommentsForMatch(matchId: string, underscore: string): Observable<number> {
  //   return this.db.list(`postComments${matchId}/${underscore}`).snapshotChanges().map(changes => changes.length);
  // }

  // getCommentsLength(matchId: string): Observable<number> {
  //   return from(this.getCommentsForMatch(matchId, '_').query.once('value')).pipe(
  //     map(snapshot => snapshot.numChildren()),
  //     map(value => value['__zone_symbol__value'])
  //   )
  // }

  async getCommentsLength(matchId: string): Promise<number> {
    const snapshot = await this.getCommentsForMatch(matchId, '_').query.once('value');
    return snapshot.numChildren();
  }

  // createComment(matchID: string, comment: SingleComment) {
  //   const commentsRef = this.db.list(`postComments${matchID}/_`);
  //   return commentsRef.push(comment);
  // }
  createComment(matchID: string, comment: SingleComment) {
    const commentsRef = this.db.list(`postComments${matchID}/_`);
    // comment.postedAt = this.getTimestamp(); // set the timestamp
    comment.postedAt = Date.now(); // set the timestamp
    return commentsRef.push(comment);
  }

  getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}