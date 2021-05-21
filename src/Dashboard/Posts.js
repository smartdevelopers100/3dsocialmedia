import React, {useState, useEffect, useRef, useCallback} from 'react';
import './Posts.css';
import {useSelector, useDispatch} from 'react-redux';
import * as postsActionTypes from '../action_types/posts';
import Loading from '../components/Loading';
import Error from '../components/Error';
import {FieldValue} from '../firebase';
import {NavLink} from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '../components/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import {UserPhoto, UserDisplayName} from './User';
import {formatTime} from '../utils/date';
import Modal from '../components/Modal';
import * as settings from '../config/settings';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {v4 as uuidv4} from 'uuid';
import TextArea from '../components/TextArea';
import ProgressBar from '../components/ProgressBar';
import * as filesActionTypes from '../action_types/files';
import {PostScene} from './Post';
import {getFileSizeInText, getFileType} from '../utils/file';

const PostItem = React.memo(React.forwardRef(({post}, ref) => {
    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const posts = useSelector(state => state.posts);

    useEffect(() => {
        if(posts.delete.data)
        {
            if(posts.delete.data.id === post.id)
            {
                setIsDeleting(true);
            }
            else
            {
                setIsDeleting(false);
            }
        }
    }, [posts.delete.data, post.id]);

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

    const items = user.uid === post.user.uid ? [...ownerItems, ...allUserItems]: allUserItems;

    return (
        <div className="post-item" ref={ref}>
            <div className="post-item__header">
                {post.user.photoURL && <UserPhoto user={post.user} />}
                <div className="post-item__header-center">
                    {post.user.displayName && <UserDisplayName user={post.user} />}
                    <div className="post-item__time">{post.createdAt ? formatTime(post.createdAt.toDate()): ''}</div>
                </div>
                <div className="post-item__action-icon">
                    <MoreVertIcon onClick={() => setShowMenu(true)} />
                    {showMenu && <Menu items={items} setShowMenu={setShowMenu} />}
                </div>
            </div>
            <div className="post-item__body">
               {post.file && <PostScene file={post.file} />}
            </div>
            <div className="post-item__footer">
                <NavLink to={`/post/${post.id}`} className="post-item__link">
                    <div className="post-item__heading">{post.heading}</div>
                    <div className="post-item__description">{post.description}</div>
                </NavLink>
                {isDeleting && posts.delete.loading && <Loading />}
                {isDeleting && posts.delete.error && <Error error={posts.delete.error} />}
            </div>
        </div>
    );
}));

const PostsContent = props => {
    const posts = useSelector(state => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {

        if(!posts.list.success)
        {
            dispatch({
                type: postsActionTypes.LIST_POSTS_LOADING
            });
            dispatch({
                type: postsActionTypes.LIST_POSTS
            });
        }

    }, [posts.list.success]);

    const [lastItem, setLastItem] = useState();
    const lastItemRef = useCallback(el => {
        if(el)
            setLastItem(el);
    }, []);

    const cb = useCallback((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting)
            {
                observer.unobserve(entry.target);
                
                dispatch({
                    type: postsActionTypes.LIST_POSTS_LOADING
                });
                dispatch({
                    type: postsActionTypes.LIST_POSTS
                });
            }
        });
    }, []);
    const observerRef = useRef(new IntersectionObserver(cb));

    useEffect(() => {
        if(lastItem)
        {
            const observer = observerRef.current;
            observer.observe(lastItem);
        }
    }, [lastItem]);

    return (
        <div className="posts-content">
            {posts.edit.data && <Modal closeModal={() => {
                                    dispatch({
                                        type: postsActionTypes.SET_EDIT_POST_INITIAL_STATE
                                    });
                                }}>
                                    <PostInput isEditing  />
                                </Modal>}
            {posts.data.map((post, index) => {
                if(posts.data.length === index + 1)
                {
                    return  <PostItem key={index}  post={post} ref={lastItemRef}  />;
                }
                return <PostItem key={index}  post={post}  />;
            })}
            {posts.list.loading && <Loading />}
            {posts.list.error && <Error error={posts.list.error} />}
        </div>
    );
}


const GetAsset = ({fileData}) => {
    const {uuid, file} = fileData;
    const url = URL.createObjectURL(file);
    if(/image/.test(file.type))
    {
        return (
            <img id={`file_${uuid}`} src={url} alt="Not available" title="Image" /> 
        );
    }

    if(/audio/.test(file.type))
    {
        return (
            <audio id={`file_${uuid}`}>
                <source type={file.type} src={url} />
            </audio>
        );
    }

    if(/video/.test(file.type))
    {
        return (
            <video id={`file_${uuid}`}>
                <source type={file.type} src={url} />
            </video>
        );
    }
    return (
        <a-asset-item response-type="arraybuffer" id={`file_${uuid}`} src={url}></a-asset-item>);
}

const GetModel = ({fileData}) => {
    const {uuid, file} = fileData;

    if(/image/.test(file.type))
    {
        return (
            <a-image
                src={`#file_${uuid}`}
                position="0 0 -2"
                scale="10 10 10"
            ></a-image>
        );
    }

    if(/audio/.test(file.type))
    {
        return (
            <>
                <a-sound
                    src={`#file_${uuid}`}
                    position="0 0 -5"
                ></a-sound>
                <a-plane media-controller={`src: #file_${uuid}`} position="0 0 -6" scale="50 50 50" color="#84e1e1"></a-plane>
            </>
        );
    }

    if(/video/.test(file.type))
    {
        return (
        <>
            <a-videosphere src={`#file_${uuid}`}></a-videosphere>
            <a-entity media-controller={`src: #file_${uuid}`}></a-entity>
        </>
        );
    }

    return (<a-gltf-model  
            src={`#file_${uuid}`}
            animation-mixer
            position="0 0 -5"
        >
        </a-gltf-model>);
}

const FilePreview = ({fileData}) => {
    return (
        <div className="file-preview">
            <a-scene embedded cursor="rayOrigin: mouse">
                <a-assests>
                    <GetAsset fileData={fileData} />
                    <img src={'play-arrow.jpg'}  id="play_media" alt="Not available" title="Image" />
                    <img src={'pause.jpg'} id="pause_media" alt="Not available" title="Image" />       
                </a-assests>

                {/audio|video/.test(fileData.file.type) && <a-entity camera look-controls mouse-cursor>
                    <a-image src="#play_media" className="user-action-media" position="-7 -1 -5" ></a-image>
                </a-entity>}
                
               <GetModel fileData={fileData} />
            </a-scene>
        </div>
    );
}

const FileDragAndDrop = ({handleChange}) => {
    return (<div className="file-drag-and-drop">
                <div className="file-upload__instruction">Upload image, audio, video, 3d model. For 3d model use only .glb file.</div>
                <label htmlFor="file" className="file-drag-and-drop__file-label">Browse</label>
                <input type="file" onChange={handleChange}
                            name="file" 
                            id="file" 
                            className="file-drag-and-drop__file"
                        />
            </div>) 
}

const FileOperations = ({fileData, setFileData, setShowFileUploadModal}) => {
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const files = useSelector(state => state.files);
    const [progress, setProgress] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if(files.upload.progresses)
        {
            if(files.upload.progresses[fileData.uuid])
            {
                setProgress(files.upload.progresses[fileData.uuid]);
            }
        }

    }, [files.upload.progresses, fileData.uuid]);

    useEffect(() => {
        if(files.upload.errors)
        {
            if(files.upload.errors[fileData.uuid])
            {
                setError(files.upload.errors[fileData.uuid]);
            }
        }

    }, [files.upload.errors, fileData.uuid]);

    useEffect(() => {
        if(files.upload.successes)
        {
            if(files.upload.successes[fileData.uuid])
                setShowFileUploadModal(false);
        }
    }, [files.upload.successes, fileData.uuid]);


    const uploadFile = () => {
        setUploading(true);
        dispatch({
            type: filesActionTypes.UPLOAD_FILES,
            payload: {
                parentPath: `${user.uid}`,
                filesData: [fileData]
            }
        });
    }

    const cancelOperation = e => {
        e.preventDefault();

        if(uploading)
        {
            dispatch({
                type: filesActionTypes.UPLOAD_FILES_CANCEL,
                payload: {
                    uuid: fileData.uuid
                }
            });
        }
        setFileData(null);
    }

    return (
        <div className="file-operations">
            <div className="file-actions">
                {!uploading && <button onClick={uploadFile} className="file-action file-action--upload">Upload</button>}
                <button className="file-action file-action--cancel" onClick={cancelOperation}>Cancel</button>
                <div className="file-size">{getFileType(fileData.file.type)} ({getFileSizeInText(fileData.file.size)})</div>
            </div>
            {progress && <ProgressBar percentage={progress.percentage} />}
            {error && <Error error={error} />}
        </div>
    );
}

const FileInput = ({setShowFileUploadModal}) => {
    const [fileData, setFileData] = useState();
    const handleChange = e => {
        const file = e.target.files[0];

        if(file)
        {
            setFileData({
                uuid: uuidv4(),
                file
            });
        }
        else
        {
            setFileData(null);
        }
    }
    return (
        <div className="file-input">
            {fileData ? 
                    <>
                        <FileOperations fileData={fileData} setFileData={setFileData} setShowFileUploadModal={setShowFileUploadModal} />
                        <FilePreview fileData={fileData} />
                    </> 
                    :
                        <FileDragAndDrop handleChange={handleChange} />
                    }
        </div>
    );
}

const UploadedFile = ({file}) =>  {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const files = useSelector(state => state.files);

    useEffect(() => {
        if(files.delete.loadings)
        {
            if(files.delete.loadings[file.id])
                setLoading(true);
            else
                setLoading(false);
        }
    }, [files.delete.loadings, file.id]);
    
    useEffect(() => {
        if(files.delete.errors)
        {
            if(files.delete.errors[file.id])
                setError(files.delete.errors[file.id]);
            else
                setError(null);
        }
    }, [files.delete.errors, file.id]);

    const deleteFile = () => {
        dispatch({
            type: filesActionTypes.DELETE_FILES_LOADING,
            payload: {
                id: file.id
            }
        });
        dispatch({
            type: filesActionTypes.DELETE_FILES,
            payload: [file]
        });
    }

    return (
        <div className="uploaded-file">
            <div className="uploaded-file__left">
                <PostScene file={file} />
            </div>
            <div className="uploaded-file__center">
                <div className="uploaded-file__data uploaded-file__data--name">{file.name}</div>
                <div className="uploaded-file__data uploaded-file__data--type">{getFileType(file.type)}</div>
                <div className="uploaded-file__data uploaded-file__data--size">{getFileSizeInText(file.size)}</div>
                {loading && <Loading />}
                {error && <Error error={error} />}
            </div>
            <div className="uploaded-file__right">
                <DeleteIcon onClick={deleteFile} />
            </div>
        </div>
    );
}

export const PostInput = ({isEditing}) => {
    const initialValues = {
        heading: '',
        description: ''
    };
    const [values, setValues] = useState(initialValues);
    const [isValid, setIsValid] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const posts = useSelector(state => state.posts);
    const [post, setPost] = useState();
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const files = useSelector(state => state.files);
    const [uploadedFile, setUploadedFile] = useState();

    useEffect(() => {
        if(files.upload.data)
        {
            setUploadedFile({id: Object.keys(files.upload.data)[0], ...Object.values(files.upload.data)[0]});
        }
        else
        {
            setUploadedFile(null);
        }

    }, [files.upload.data]);

    useEffect(() => {
        if(files.delete.data)
        {
            dispatch({
                type: filesActionTypes.SET_FILES_INITIAL_STATE
            });
        }
    }, [files.delete.data]);

    useEffect(() => {
        if(!isEditing)
        {
            if(values.heading && uploadedFile)
            {
                setIsValid(true);
                return;
            }
        }
        else
        {
            if(values.heading)
            {
                setIsValid(true);
                return;
            }
        }
        
        setIsValid(false);

    }, [isEditing, values, uploadedFile]);

    useEffect(() => {
        if(posts.edit.data)
        {
            setPost(posts.edit.data);
        }
    }, [posts.edit.data]);

    useEffect(() => {
        if(isEditing && post)
        {
            setValues(prevValues => ({
                ...prevValues,
                heading: post.heading,
                description: post.description
            }));
        }
    }, [isEditing, post]);

    useEffect(() => {
        if(posts.edit.success)
        {
            dispatch({
                type: postsActionTypes.SET_EDIT_POST_INITIAL_STATE
            });
        }

    }, [posts.edit.success]);

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;

        if(value === ' ') return;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        if(!isEditing)
        {
            dispatch({
                type: postsActionTypes.CREATE_POST_LOADING
            });
            dispatch({
                type: postsActionTypes.CREATE_POST,
                payload: {
                    ...values,
                    file: uploadedFile,
                    uid: user.uid,
                    createdAt: FieldValue.serverTimestamp()
                }
            });
        }
        else
        {
            const data = uploadedFile ? { 
                ...values,
                file: uploadedFile,
                editedAt: FieldValue.serverTimestamp()
            }: {
                ...values,
                editedAt: FieldValue.serverTimestamp()
            };
            dispatch({
                type: postsActionTypes.EDIT_POST_LOADING
            });
            dispatch({
                type: postsActionTypes.EDIT_POST,
                payload: {
                    id: post.id,
                    data
                }
            });
        }

        setValues(initialValues);
        dispatch({
            type: filesActionTypes.SET_FILES_INITIAL_STATE
        });
    }

    return (
        <div className="post-input">
            <form onSubmit={handleSubmit} className="post-input__form">
                <TextArea value={values.heading} label="Heading" name="heading" handleChange={handleChange} />
                <TextArea value={values.description} label="Description" name="description" handleChange={handleChange}  />
                <div className="post-input__btns">
                    <div className="file-input">
                        <AttachFileIcon onClick={() => {
                            setShowFileUploadModal(true);
                                dispatch({
                                    type: filesActionTypes.SET_UPLOAD_FILES_INITIAL_STATE
                                });
                            }} />
                            {showFileUploadModal && <Modal closeModal={() => {
                                                    setShowFileUploadModal(false);
                                                }} >
                                            <FileInput setShowFileUploadModal={setShowFileUploadModal} />
                                        </Modal>}
                    </div>
                    <input type="submit" value="Post" disabled={!isValid} className="post-input__submit-btn" />
                </div>
            </form>
            {uploadedFile &&  <UploadedFile file={uploadedFile} />}
            {posts.create.loading && <Loading />}
            {posts.create.error && <Error error={posts.create.error} />}
            {isEditing && posts.edit.loading && <Loading />}
            {isEditing && posts.edit.error && <Error error={posts.edit.error} />}
        </div>
    );
}

function Posts() {
    const dispatch = useDispatch();
    useEffect(() => {

        return () => {
            dispatch({
                type: filesActionTypes.SET_FILES_INITIAL_STATE
            });
        }
    }, []);
    
    return (
        <div className="posts">  
            <PostInput />
            <PostsContent />    
        </div>
    );
}

export default Posts;
