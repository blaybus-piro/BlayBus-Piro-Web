const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://blarybus.seunghooo.p-e.kr/',
            changeOrigin: true,
            pathRewrite: { ///api를 지우고 요청을 보냄
                '^/api': '',
            },
        })
    );
};