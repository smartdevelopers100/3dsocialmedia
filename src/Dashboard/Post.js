import React, {useState, useEffect} from 'react';
import './Post.css';
import {useSelector, useDispatch} from 'react-redux';
import * as postsActionTypes from '../action_types/posts';
import Loading from '../components/Loading';
import Error from '../components/Error';
import {NavLink} from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '../components/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import {UserPhoto, UserDisplayName} from './User';
import {formatTime} from '../utils/date';
import * as settings from '../config/settings';
import {useParams, useHistory} from 'react-router-dom';
import Modal from '../components/Modal';
import {PostInput} from './Posts';
import * as filesActionTypes from '../action_types/files';

const GetPostAsset = ({file}) => {
    const {id} = file;
    const url = `${settings.PROXY}/${file.url}`;
    if(/image/.test(file.type))
    {
        return (
            <img id={`file_${id}`} src={url} alt="Not available" title="Image" crossOrigin="anonymous" /> 
        );
    }

    if(/audio/.test(file.type))
    {
        return (
            <audio id={`file_${id}`}>
                <source type={file.type} src={url} crossOrigin="anonymous" />
            </audio>
        );
    }

    if(/video/.test(file.type))
    {
        return (
            <video id={`file_${id}`}>
                <source type={file.type} src={url} crossOrigin="anonymous" />
            </video>
        );
    }
    return (
        <a-asset-item response-type="arraybuffer" id={`file_${id}`} src={url} crossOrigin="anonymous" ></a-asset-item>);
}


const GetPostModel = ({file}) => {
    const {id} = file;
    if(/image/.test(file.type))
    {
        return (
            <a-image
                src={`#file_${id}`}
                position="0 0 -3"
                scale="30 10 10"
            ></a-image>
        );
    }

    if(/audio/.test(file.type))
    {
        return (
            <>
                <a-sound
                    src={`#file_${id}`}
                    position="0 0 -5"
                ></a-sound>
                <a-plane media-controller={`src: #file_${id}`} position="0 0 -5" scale="50 50 50" color="#84e1e1"></a-plane>
            </>
        );
    }

    if(/video/.test(file.type))
    {
        return (
        <>
            <a-videosphere src={`#file_${id}`}></a-videosphere>
            <a-entity media-controller={`src: #file_${id}`}></a-entity>
        </>
        );
    }

    return (<a-gltf-model  
            src={`#file_${id}`}
            animation-mixer
            position="0 0 -5"
        >
        </a-gltf-model>);
}

export const PostScene = ({file}) => {
    return(<div className="post-scene-container">
            <a-scene embedded cursor="rayOrigin: mouse">
                <a-assests>
                    <GetPostAsset file={file} />
                    <img src={'play-arrow.jpg'}  id="play_media" alt="Not available" title="Image" />
                    <img src={'pause.jpg'} id="pause_media" alt="Not available" title="Image" />       
                </a-assests>

                {/audio|video/.test(file.type) && <a-entity camera look-controls mouse-cursor>
                    <a-image src="#play_media" className="user-action-media" position="-7 -1 -5" ></a-image>
                </a-entity>}
                
               <GetPostModel file={file} />
            </a-scene>
        </div>
    );
}

const Post = () => {
    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const posts = useSelector(state => state.posts);
    const params = useParams();
    const [post, setPost] = useState();
    const history = useHistory();

    useEffect(() => {

        return () => {
            dispatch({
                type: filesActionTypes.SET_FILES_INITIAL_STATE
            });
            dispatch({
                type: postsActionTypes.SET_GET_POST_INITIAL_STATE
            });
        }
    }, []);

    useEffect(() => {
        if(posts.list.success)
        {
            const post = posts.data.find(post => post.id === params.postId);
            if(post)
            {
                dispatch({
                    type: postsActionTypes.GET_POST_SUCCESS,
                    payload: post
                });
            }
            else
            {
                history.push('/');
            }
        }
        else
        {
            dispatch({
                type: postsActionTypes.GET_POST_LOADING
            });
            dispatch({
                type: postsActionTypes.GET_POST,
                payload: {
                    id: params.postId
                }
            });
        }

    }, [posts.list.success, params.postId]);

    useEffect(() => {
        if(posts.get.redirect)
        {
            history.push('/');
        }
    }, [posts.get.redirect]);

    useEffect(() => {
        if(posts.get.data)
        {
            setPost(posts.get.data);
        }
    }, [posts.get.data]);

    useEffect(() => {
        if(posts.delete.data)
        {
            setIsDeleting(true);
        }
        else
        {
            setIsDeleting(false)
        }
    }, [posts.delete.data]);

    useEffect(() => {
        if(posts.delete.success)
        {
            history.push('/');
        }

    }, [posts.delete.success]);

    const ownerItems = [
        {
            title: "Edit",
            Icon: EditIcon,
            onClick: () => {
                dispatch({
                    type: postsActionTypes.SET_EDIT_POST_DATA,
                    payload: post
                });
            }
        },
        {
            title: "Delete",
            Icon: DeleteIcon,
            onClick: () => {
                dispatch({
                    type: postsActionTypes.SET_DELETE_POST_DATA,
                    payload: {
                        id: post.id
                    }
                });
                dispatch({
                    type: postsActionTypes.DELETE_POST_LOADING
                });
                dispatch({
                    type: postsActionTypes.DELETE_POST,
                    payload: {
                        id: post.id
                    }
                });
            }
        }
    ];

    const allUserItems = [
        {
            title: "Copy link",
            Icon: LinkIcon,
            onClick: async () => {
                try
                {
                    await navigator.clipboard.writeText(`${settings.HOST}/post/${post.id}`);
                }
                catch(err)
                {}
            }
        }
    ]; 

    let items = [];
   if(post && post.user.uid === user.uid)
   {
       items = [...ownerItems, ...allUserItems];       
   }
   else
   {
       items = allUserItems;
   }

    return (
        <div className="post">
            {posts.edit.data && <Modal closeModal={() => {
                                    dispatch({
                                        type: postsActionTypes.SET_EDIT_POST_INITIAL_STATE
                                    });
                                }}>
                        <PostInput isEditing  />
                </Modal>}
            {post &&
            <>
            <div className="post__header">
                {post.user.photoURL && <UserPhoto user={post.user} />}
                <div className="post__header-center">
                    {post.user.displayName && <UserDisplayName user={post.user} />}
                    <div className="post__time">{post.createdAt ? formatTime(post.createdAt.toDate()): ''}</div>
                </div>
                <div className="post__action-icon">
                    <MoreVertIcon onClick={() => setShowMenu(true)} />
                    {showMenu && <Menu items={items} setShowMenu={setShowMenu} />}
                </div>
            </div>
            <div className="post__body">
               {post.file && <PostScene file={post.file} />}
            </div>
            <div className="post__footer">
                {isDeleting && posts.delete.loading && <Loading />}
                {isDeleting && posts.delete.error && <Error error={posts.delete.error} />}
                <div className="post__heading">{post.heading}</div>
                <div className="post__description">{post.description}</div>
            </div>
            </>}
            {posts.get.loading && <Loading />}
            {posts.get.error && <Error error={posts.get.error} />}
        </div>
    );
}

export default Post;
