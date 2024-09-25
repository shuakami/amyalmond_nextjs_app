// src/pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ThemeProvider } from '@/components/theme-provider';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="zh">
                <Head>
                    {/* 全局的 Meta 信息可以保留基础信息 */}
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
