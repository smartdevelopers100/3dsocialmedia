import { combineEpics } from 'redux-observable';
import * as authEpics from  './auth';
import * as filesEpics from './files';
import * as postsEpics from './posts';

const rootEpic = combineEpics(
                        ...Object.values(authEpics),
                        ...Object.values(filesEpics),
                        ...Object.values(postsEpics)
                    );

export default rootEpic;