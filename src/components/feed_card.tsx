import { format } from "@astroimg/timeago";
import { Link } from "wouter";

export function FeedCard({ id, title, avatar, draft, listed, summary, hashtags, createdAt, updatedAt }: { id: string, avatar?: string, draft?: number, listed?: number, title: string, summary: string, hashtags: { id: number, name: string }[], createdAt: Date, updatedAt: Date }) {
    return (
        <>
            <Link href={`/feed/${id}`} target="_blank" className="wauto rounded-2xl bg-white m-2 p-6 hover:bg-neutral-200 duration-300">
                {avatar &&
                    <div className="flex flex-row items-center mb-2">
                        <img src={avatar} alt=""
                            className="object-cover object-center w-full max-h-96 rounded-xl" />
                    </div>}
                <h1 className="text-xl font-bold text-gray-700 text-pretty overflow-hidden">
                    {title}
                </h1>
                <div className="space-x-2">
                    <span className="text-gray-400 text-sm" title={new Date(createdAt).toLocaleString()}>
                        {format(createdAt) + (createdAt === updatedAt ? '' : '发布')}
                    </span>
                    {createdAt !== updatedAt &&
                        <span className="text-gray-400 text-sm" title={new Date(updatedAt).toLocaleString()}>
                            {format(updatedAt) + '更新'}
                        </span>
                    }
                    {draft === 1 && <span className="text-gray-400 text-sm">草稿</span>}
                    {listed === 0 && <span className="text-gray-400 text-sm">未列出</span>}
                </div>
                <p className="text-pretty overflow-hidden">
                    {summary}
                </p>
                {hashtags.length > 0 &&
                    <div className="mt-2 flex flex-row">
                        {hashtags.map(({ name }, index) => (
                            <div key={index} className="bg-neutral-100 py-1 px-2 m-1 rounded-lg">
                                {name}
                            </div>
                        ))}
                    </div>
                }

            </Link>
        </>
    )
}