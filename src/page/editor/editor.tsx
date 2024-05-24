import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { clipboard } from '@milkdown/plugin-clipboard';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { Milkdown, useEditor } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import 'katex/dist/katex.min.css';
import { slash, SlashView } from './slash';
import { rin } from './theme';
import { tooltip, TooltipView } from './tooltip';

const markdown = localStorage.getItem('markdown') || ''

export function MilkdownEditor() {
    const pluginViewFactory = usePluginViewFactory();

    useEditor((root) => {
        return Editor
            .make()
            .config(ctx => {
                ctx.set(rootCtx, root)
                ctx.set(defaultValueCtx, markdown)
                ctx.set(slash.key, {
                    view: pluginViewFactory({
                        component: SlashView,
                    })
                })
                ctx.set(tooltip.key, {
                    view: pluginViewFactory({
                        component: TooltipView,
                    })
                })
                const listener = ctx.get(listenerCtx);

                listener.markdownUpdated((_, markdown, prevMarkdown) => {
                    if (markdown !== prevMarkdown) {
                        localStorage.setItem('markdown', markdown);
                    }
                })
            })
            .config(rin)
            .use(commonmark)
            .use(gfm)
            .use(slash)
            .use(tooltip)
            .use(history)
            .use(clipboard)
            .use(listener)
    }, [])

    return <Milkdown />
}
