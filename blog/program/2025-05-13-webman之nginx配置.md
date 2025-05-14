---
slug: php-webman-nginx-config
title: webman之nginx配置
date: 2025-05-13
authors: peterlee
tags: [php, develop]
keywords: [php, develop]
image: https://images.unsplash.com/photo-1746311372686-e164b0bcb333?q=80&w=4740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---
简单记录一下部署webman时使用的nginx配置
<!-- truncate -->

![](https://images.unsplash.com/photo-1746311372686-e164b0bcb333?q=80&w=4740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

webman框架的config/process.php中定义了Http协议的端口为8787
> 我的服务器46核心，如果下面的count*4,直接会导致服务器宕机，切记...
~~~
<?php
use support\Log;
use support\Request;
use app\process\Http;

global $argv;

return [
    'webman'           => [
        'handler'     => Http::class,
        'listen'      => 'http://0.0.0.0:8787',
//        'count' => cpu_count() * 4,
        'count'       => 8,
        'user'        => '',
        'group'       => '',
        'reusePort'   => false,
        'eventLoop'   => '',
        'context'     => [],
        'constructor' => [
            'requestClass' => Request::class,
            'logger'       => Log::channel('default'),
            'appPath'      => app_path(),
            'publicPath'   => public_path()
        ]
    ],
    // File update detection and automatic reload
    'monitor'          => [
        'handler'     => app\process\Monitor::class,
        'reloadable'  => false,
        'constructor' => [
            // Monitor these directories
            'monitorDir'        => array_merge([
                app_path(),
                config_path(),
                base_path() . '/process',
                base_path() . '/support',
                base_path() . '/resource',
                base_path() . '/.env',
            ], glob(base_path() . '/plugin/*/app'), glob(base_path() . '/plugin/*/config'), glob(base_path() . '/plugin/*/api')),
            // Files with these suffixes will be monitored
            'monitorExtensions' => [
                'php', 'html', 'htm', 'env'
            ],
            'options'           => [
//                'enable_file_monitor' => !in_array('-d', $argv) && DIRECTORY_SEPARATOR === '/',
                'enable_file_monitor'   => true,
                'enable_memory_monitor' => DIRECTORY_SEPARATOR === '/',
            ]
        ]
    ],
    'ProductAiTask'    => [
        'handler' => \app\task\ProductAiTask::class
    ],
    'GetFriendsCircleTask' => [
        'handler' => \app\task\GetFriendsCircleTask::class
    ],
    'UnreadMsgNotify' => [
        'handler' => \app\task\UnreadMsgNotify::class
    ]
];

~~~

config/plugin/webman/push/app.php定义了pushjs推送的相关配置(端口为3131):
~~~php
<?php
return [
    'enable'       => true,
    'websocket'    => 'websocket://0.0.0.0:3131',
    'api'          => 'http://0.0.0.0:3232',
    'app_key'      => 'you_app_key',
    'app_secret'   => 'you_app_secret',
    'channel_hook' => 'https://xxx.com/plugin/webman/push/hook',
    'auth'         => '/plugin/webman/push/auth'
];
~~~

所以nginx主要配置是反向代理到这两个端口上(8787,3131)
~~~nginx
upstream webman {
    server 127.0.0.1:8787;
    keepalive 10240;
}

upstream webman_ws {
    server 127.0.0.1:3131;
    keepalive 10240;
}

server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;

    server_name pyqmall.dev.peirenlei.cn;
    root /www/pyqmall/public;
  
    charset utf-8;

    ssl_certificate /ssl/common/fullchain.pem;
    ssl_certificate_key /ssl/common/privkey.pem;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;


	location ^~ / {
	  proxy_set_header Host $http_host;
	  proxy_set_header X-Forwarded-For $remote_addr;
	  proxy_set_header X-Forwarded-Proto $scheme;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_http_version 1.1;
	  proxy_set_header Connection "";
	  if (!-f $request_filename){
	      proxy_pass http://webman;
	  }
	}

    # 新增的用于处理 /ws路径的websocket配置
    location /ws {
        proxy_pass http://webman_ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }

    access_log  /var/log/nginx/webman.access.log  main;
    error_log  /var/log/nginx/webman.error.log  warn;
}
~~~