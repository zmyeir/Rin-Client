import { format } from "@astroimg/timeago";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useContext, useEffect, useRef, useState } from "react";
import { Header } from "../components/header";
import { Icon, IconSmall } from "../components/icon";
import { Padding } from "../components/padding";
import { client } from "../main";
import { ProfileContext } from "../state/profile";
import { headersWithAuth } from "../utils/auth";

type Feed = {
    id: number;
    title: string | null;
    content: string;
    uid: number;
    createdAt: Date;
    updatedAt: Date;
    hashtags: {
        id: number;
        name: string;
    }[];
    user: {
        avatar: string | null;
        id: number;
        username: string;
    };
}

export function FeedPage({ id }: { id: string }) {
    return (
        <>
            <Header />
            <Padding>
                <Feed id={id} />
            </Padding>
        </>
    )
}

function Feed({ id }: { id: string }) {
    const profile = useContext(ProfileContext);
    const [feed, setFeed] = useState<Feed>()
    const [error, setError] = useState<string>()
    const ref = useRef("")
    useEffect(() => {
        if (ref.current == id) return
        client.feed({ id }).get({
            headers: headersWithAuth()
        }).then(({ data, error }) => {
            if (error) {
                setError(error.value as string)
            } else if (data && typeof data !== 'string') {
                setFeed(undefined)
                setTimeout(() => {
                    setFeed(data)
                }, 0)
            }
        })
        ref.current = id
    }, [id])
    return (
        <>
            <div className="w-full flex flex-col justify-center items-center">
                {error &&
                    <>
                        <div className="flex flex-col wauto rounded-2xl bg-white m-2 p-6 items-center justify-center">
                            <h1 className="text-xl font-bold text-gray-700">
                                {error}
                            </h1>
                            <button className="mt-2 bg-theme text-white px-4 py-2 rounded-full" onClick={() => window.location.href = '/'}>
                                返回首页
                            </button>
                        </div>
                    </>
                }
                {feed &&
                    <div className="wauto rounded-2xl bg-white m-2 p-6">
                        <div className="flex flex-row items-center">
                            <h1 className="text-xl font-bold text-gray-700">
                                {feed.title}
                            </h1>
                            {profile?.permission && <div className="flex-1 flex flex-col items-end justify-center">
                                <Icon name="ri-edit-2-line ri-lg" onClick={() => window.location.href = `/writing/${id}`} />
                            </div>}
                        </div>
                        <div className="my-2">
                            <p className="text-gray-400 text-sm" title={new Date(feed.createdAt).toLocaleString()}>
                                发布于 {format(feed.createdAt)}
                            </p>
                            {feed.createdAt !== feed.updatedAt &&
                                <p className="text-gray-400 text-sm" title={new Date(feed.updatedAt).toLocaleString()}>
                                    更新于 {format(feed.updatedAt)}
                                </p>
                            }
                        </div>
                        <MarkdownPreview source={feed.content} />
                        {feed.hashtags.length > 0 &&
                            <div className="mt-2 flex flex-row space-x-2">
                                {feed.hashtags.map(({ name }, index) => (
                                    <div key={index} className="bg-neutral-100 py-1 px-2 rounded-lg">
                                        {name}
                                    </div>
                                ))}
                            </div>
                        }
                        <div className="mt-2 flex flex-row items-center">
                            <img src={feed.user.avatar || '/avatar.png'} className="w-8 h-8 rounded-full" />
                            <div className="ml-2">
                                <span className="text-gray-400 text-sm">
                                    {feed.user.username}
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {feed && <Comments id={id} />}
                <div className="h-16" />
            </div>
        </>
    )
}

function CommentInput({ id, onRefresh }: { id: string, onRefresh: () => void }) {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    function submit() {
        client.feed.comment({ feed: id }).post(
            { content },
            {
                headers: headersWithAuth()
            }).then(({ error }) => {
                if (error) {
                    setError(error.value as string)
                } else {
                    setContent("")
                    setError("")
                    alert("评论成功")
                    onRefresh()
                }
            })
    }
    return (
        <div className="wauto rounded-2xl bg-white m-2 p-6 items-end flex flex-col">
            <textarea placeholder="说点什么吧" className="w-full h-24 p-2 rounded-lg" value={content} onChange={e => setContent(e.target.value)} />
            <button className="mt-2 bg-theme text-white px-4 py-2 rounded-full" onClick={submit}>
                发表评论
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    )
}




type Comment = {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        username: string;
        avatar: string | null;
        permission: number | null;
    };
}

function Comments({ id }: { id: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [error, setError] = useState<string>()
    const ref = useRef("")
    function loadComments() {
        client.feed.comment({ feed: id }).get({
            headers: headersWithAuth()
        }).then(({ data, error }) => {
            if (error) {
                setError(error.value as string)
            } else if (data && Array.isArray(data)) {
                setComments(data)
            }
        })
    }
    useEffect(() => {
        if (ref.current == id) return
        loadComments()
        ref.current = id
    }, [id])
    return (
        <>
            <div className="w-full flex flex-col justify-center items-center">
                <CommentInput id={id} onRefresh={loadComments} />
                {error &&
                    <>
                        <div className="flex flex-col wauto rounded-2xl bg-white m-2 p-6 items-center justify-center">
                            <h1 className="text-xl font-bold text-gray-700">
                                {error}
                            </h1>
                            <button className="mt-2 bg-theme text-white px-4 py-2 rounded-full" onClick={loadComments}>
                                重新加载
                            </button>
                        </div>
                    </>
                }
                {comments.length > 0 &&
                    <div className="wauto rounded-2xl bg-white m-2 p-2 space-y-2">
                        {comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} onRefresh={loadComments} />
                        ))}
                    </div>
                }
            </div>
        </>
    )
}

function CommentItem({ comment, onRefresh }: { comment: Comment, onRefresh: () => void }) {
    const profile = useContext(ProfileContext);
    function deleteComment() {
        // 询问
        if (!confirm("确定要删除这条评论吗？")) return
        client.comment({ id: comment.id }).delete(null, {
            headers: headersWithAuth()
        }).then(({ error }) => {
            if (error) {
                alert(error.value)
            } else {
                alert("删除成功")
                onRefresh()
            }
        })
    }
    return (
        <div className="flex flex-row items-start hover:bg-neutral-200 p-2 rounded-xl">
            <img src={comment.user.avatar || ''} className="w-8 h-8 rounded-full" />
            <div className="ml-2">
                <span className="text-gray-400 text-sm">
                    {comment.user.username}
                </span>
                <p>
                    {comment.content}
                </p>
            </div>
            <div className="flex-1" />
            <div className="flex flex-col items-end">
                <span title={new Date(comment.createdAt).toLocaleString()} className="text-gray-400 text-sm">
                    {format(comment.createdAt)}
                </span>
                {(profile?.permission || profile?.id == comment.user.id) && <div className="flex flex-row">
                    <IconSmall name="ri-delete-bin-2-line ri-sm" onClick={deleteComment} />
                </div>
                }
            </div>
        </div>)
}