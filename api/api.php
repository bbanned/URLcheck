<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// 基础配置
$config = require __DIR__ . '/config.php';

// 获取参数
$url = $_GET['url'] ?? '';
$type = $_GET['type'] ?? '';
$nodeid = $_GET['nodeid'] ?? 'oversea'; // 默认检测美版safari

if (empty($url)) {
    die(json_encode(['error' => true, 'msg' => '请提供URL']));
}

// 根据类型选择不同的 API 端点
$api_endpoint = '';
if ($type === 'rcs') {
    $api_endpoint = "https://api.uouin.com/app/google";
} elseif ($type === 'imessage') {
    $api_endpoint = "https://api.uouin.com/app/safari";
} else {
    die(json_encode(['error' => true, 'msg' => '无效的检测类型']));
}

// 添加延迟以控制 API 调用频率
usleep($config['api_delay'] * 1000000);

$query_params = http_build_query([
    'username' => $config['username'],
    'key' => $config['key'],
    'url' => $url,
]);

if ($type === 'imessage') {
    $query_params .= "&nodeid={$nodeid}";
}

try {
    $result = file_get_contents("{$api_endpoint}?{$query_params}");
    $json = json_decode($result, true);
    
    // 处理所有可能的错误码
    if (!$json || (isset($json['code']) && intval($json['code']) < 0)) {
        $errorMessages = [
            -200 => '用户名不能为空',
            -201 => '密钥不能为空',
            -202 => 'URL不能为空',
            -203 => '点数包余额不足',
            -204 => '访问频率超限',
            -205 => 'API地址错误',
            -206 => 'VIP会员已过期',
            -207 => '用户名或密钥错误',
            -208 => 'IP未白名单',
            -209 => '账户状态异常',
            -210 => '接口异常',
            -211 => '未绑定手机号',
            -212 => '检测超时',
            -213 => '网址存在安全风险',
            -214 => 'API功能未开通'
        ];
        
        die(json_encode([
            'error' => true,
            'code' => $json['code'] ?? -210,
            'msg' => $errorMessages[$json['code']] ?? ($json['msg'] ?? '接口异常')
        ]));
    }

    echo json_encode($json);

} catch (Exception $e) {
    die(json_encode([
        'error' => true,
        'code' => -210,
        'msg' => '服务器错误'
    ]));
}