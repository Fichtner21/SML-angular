import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SingleComment } from './single-comment.model';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  private dbPath = '/';

  commentsRef: AngularFireList<SingleComment>;

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private activatedRoute: ActivatedRoute) { 
    this.commentsRef = db.list(this.dbPath);
    
  }

  getAll(): AngularFireList<SingleComment> {
    return this.commentsRef;
  }

  getSingleComment(comment:string): AngularFireList<SingleComment> {
    // console.log('this.commentsRef', this.commentsRef);
    return this.commentsRef;
  } 

  create(comment: SingleComment): any {
    return this.commentsRef.push(comment);
  }

  // getAll2(): Observable<SingleComment[]>{  
  //   return this.afs.collection<SingleComment>('/').valueChanges<string>({idField: 'id'});
  // }
 
}
