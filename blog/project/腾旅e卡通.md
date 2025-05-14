---
slug: tennv-ekt
title: 腾旅e卡通旅游年卡
date: 2025-05-04
authors: peterlee
tags: [project, web]
keywords: [project, web]
description: 腾旅e卡通旅游年卡
image: /img/project/tennv.png
---

由武汉旅游发展投资集团有限公司和腾讯公司共同出资，省市旅游委（局）大力支持，湖北腾旅科技有限责任公司研发运营的一张手机里的旅游年卡，为全国首张“刷脸”入园的旅游年卡
<!-- truncate -->

## 项目职责
作为项目创始人兼首席技术官（CTO），主导从0到1的系统架构设计与核心代码开发，独立完成首版全栈架构（前端/后端/嵌入式）的搭建与实现。后续成功组建并领导30+技术团队，完成人才梯队建设与技术体系标准化，实现研发效能的规模化提升。


## 技术架构
* 多端平台架构：构建高可用分布式系统，涵盖官网（Web）、微信生态矩阵（小程序+公众号）及物联网终端，采用Laravel框架+lvs实现十万级流量下的毫秒级响应。
* 智能终端系统：自主研发基于Android的嵌入式人脸识别闸机系统，通过Express定制高性能微服务架构，支持万级并发人脸特征实时比对，准确率99.98%。
* 混合数据中台：设计MySQL+MongoDB多模数据架构，实现结构化数据与JSON文档的智能分片存储，10年零故障运行，成功承载单日峰值百万级入园业务。

## 技术成就
首创"无感通行"智慧园区解决方案，通过动态负载均衡与边缘计算技术，在万人级瞬时并发场景下仍保持＜200ms的终端响应，系统可用性达99.999%（5个9标准）。

## 来几张截图

![NKQ6dY](/img/project/tennv-01.png)
![NKQ6dY](/img/project/tennv-02.png)

## 随便贴点源码(商业源码不公开)

```php
<?php
/**
 * Created by PhpStorm.
 * User: peirenlei
 * Date: 2017/9/28
 * Time: 10:42
 */

namespace App\Repositories;

use App\Commons\ErrorCode;
use phpseclib\Crypt\AES;

class AESRepository
{
    protected function buildAES($key)
    {
        $aes = new AES(AES::MODE_ECB);
        $appkey = $key;
        $aes->setKey($appkey);

        return $aes;
    }

    /**
     * $sign = hash_hmac('sha1', strtoupper(md5(cardsn=$cardsn&timestamp=$timestamp&key=$key)), $key);
     * $plainText : $cardsn|$timestamp|$sign
     * @param string $cardsn : $cardsn
     * @param string $key
     * @return string
     */
    public function encryptQrcode($cardsn, $key)
    {
        $aes = $this->buildAES($key);
        $timestamp = time();

        $sign = $this->sign(sprintf('cardsn=%s&timestamp=%s&key=%s', $cardsn, $timestamp, $key), $key);

        $plainText = $cardsn . '|' . $timestamp . '|' . $sign;

        $ciphertext = base64_encode($aes->encrypt($plainText));
        return $ciphertext;
    }

    /**
     * @param string $ciphertext
     * @param string $key
     * @return string
     */
    public function decryptQrcode($ciphertext, $key)
    {
        $aes = $this->buildAES($key);

        $decryptText = $aes->decrypt(base64_decode($ciphertext));
        var_dump($decryptText);

        $parts = explode('|', $decryptText);
        if (count($parts) != 3) {
            return ['errorcode' => ErrorCode::$ERROR_AES_Decrypt_DataError];
        }
        $partsCardsn = $parts[0];
        $partsTimestamp = $parts[1];
        $partsSign = $parts[2];

        $signOk = $this->verifysign(sprintf('cardsn=%s&timestamp=%s&key=%s', $partsCardsn, $partsTimestamp, $key), $partsSign, $key);
        if ($signOk) {
            return compact('partsCardsn', 'partsTimestamp', 'partsSign');
        }
        return ['errorcode' => ErrorCode::$ERROR_AES_Decrypt_SignError];
    }

    public function encryptOfflinedata($data, $key)
    {
        $aes = $this->buildAES($key);
        $ciphertext = base64_encode($aes->encrypt($data));
        return $ciphertext;
    }

    public function decryptOfflinedata($ciphertext, $key)
    {
        runlog("decryptOfflinedata",[$ciphertext]);


        $aes = $this->buildAES($key);

        $decryptText = $aes->decrypt(base64_decode($ciphertext));
//        var_dump($decryptText);

//        parse_str($decryptText, $parts);
        $tmpparts = explode("&",$decryptText);
        $parts = [];
        foreach ($tmpparts as $item){
            $itemparts = explode("=",$item);
            $_key = $itemparts[0];
            $value = $itemparts[1];
            $parts[$_key] = $value;
        }

        $facedata = $parts['facedata'];
        $qian=array(" ","　","\t","\n","\r");$hou=array("","","","","");
        $facedata = str_replace($qian,$hou,$facedata);
        $parts['facedata'] = $facedata;

        println(" parts.count => " .count($parts)) ;

        if (count($parts) != 7) {
            println("parts != 7");
            return ['errorcode' => ErrorCode::$ERROR_AES_Decrypt_DataError];
        }

        println(md5($parts['facedata']));

        runlog("facedata1",[$parts['facedata']]);

        $params = array_except($parts, ['sign','facedata']);

        print_r(array_merge($params, ["key" => $key]));

        $data = http_build_query(array_merge($params, ["key" => $key]));
        $params['sign'] = $parts['sign'];
        $signOk = $this->verifysign($data, $params['sign'], $key);

//        echo $parts['facedata'];
//        runlog("facedata",[$parts['facedata']]);

        runlog("facedata1",[md5($parts['facedata'])]);

        if ($signOk) {
            $qian=array(" ","　","\t","\n","\r");$hou=array("","","","","");
            $parts['facedata'] = str_replace($qian,$hou,$parts['facedata']);
//            $parts['facedata'] = str_replace([" "],[""],$parts['facedata']);

            runlog("facedata2",[md5($parts['facedata'])]);
            return $parts;
        }
        return ['errorcode' => ErrorCode::$ERROR_AES_Decrypt_SignError];
    }

    /**
     * @param string $data
     * @param string $key
     * @return string
     */
    public function sign($data, $key)
    {
        return strtoupper(hash_hmac('sha1', strtoupper(md5($data)), $key));
    }

    /**
     * @param string $data
     * @param string $sign
     * @param string $key
     * @return string
     */
    public function verifysign($data, $sign, $key)
    {
        return $sign === $this->sign($data, $key);
    }
}
```

```php
<?php

namespace App\Repositories;

use App\Commons\ErrorCode;
use App\Models\Card;
use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Support\Str;
use Pimple\Container;

class CardRepository extends BaseRepository
{
    protected $cacheRepo;
    protected $memberRepo;
    protected $redisKeyPrefix;

    public function __construct(Container $container)
    {
        $this->cacheRepo = $container->cacheRepo;
        $this->memberRepo = $container->memberRepo;
        $this->redisKeyPrefix = config("app.redis_key_prefix");
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Card::class;
    }

    public function findByField($field, $value)
    {
        $this->log(__METHOD__, [$field, $value]);
        return Card::where($field, $value)->get();
    }

    public function findByCardSn($cardsn)
    {
        $this->log(__METHOD__, [$cardsn]);
        $cacheKey = $this->redisKeyPrefix . 'db:cards:sn:' . $cardsn;
        $timeout = 60 * 1;

        $data = $this->cacheRepo->getObject($cacheKey);
        if (!$data) {
            $data = $this->findByField('card_sn', $cardsn)->first();
            if ($data) {
                $this->cacheRepo->cacheObject($cacheKey, $data);
                $this->cacheRepo->expire($cacheKey, $timeout);
            }
            $this->log(__METHOD__, [$cardsn, $data]);
        }
        return $data;
    }

    public function refreshCardCache($cardsn)
    {
        $cacheKey = $this->redisKeyPrefix . 'db:cards:sn:' . $cardsn;
        $this->cacheRepo->del($cacheKey);
    }

    public function activateCountByPhone($phone)
    {
        return Member::where('phone', $phone)->count();
    }

    public function findUserCards($loginUserId, $memberIds)
    {
        //return compact('loginUserId','memberIds');

        try {
            $query = "select cards.id,cards.card_sn,cards.card_state,cards.member_id,cards.buyer_id,cards.exchanger_id,cards.buy_at,cards.activate_at,cards.expire_date,cards.freezen_at,cards.seal_at,";
            $query .= " members.sex,members.name,members.faceurl from cards ";
            $query .= "left join members on cards.member_id = members.id ";
            $where = "where cards.buyer_id >= 0 and cards.deleted_at is null and members.deleted_at is null and (";

            //未兑换
            {
                if (count($memberIds) > 0) {
                    //未兑换,自己购买,或者自己激活的卡
                    $_memberIds = "(" . implode(",", $memberIds) . ")";
                    $where .= " ((cards.buyer_id = {$loginUserId} or cards.member_id in {$_memberIds}) and cards.exchanger_id <= 0)";
                } else {
                    //未兑换,自己购买
                    $where .= " (cards.buyer_id = {$loginUserId} and cards.exchanger_id <= 0)";
                }
            }

            //已兑换
            {
                //已兑换,别人购买,被自己兑换
                $where .= " or (cards.exchanger_id = {$loginUserId} and cards.buyer_id != {$loginUserId})";

                //已兑换,被别人兑换,用自己的手机号码激活的
                if (count($memberIds) > 0) {
                    $_memberIds = "(" . implode(",", $memberIds) . ")";
                    $where .= " or (cards.exchanger_id > 0 and cards.member_id in {$_memberIds}) ";
                }
            }


            $where .= ")";
            $query .= $where;
            $query .= " order by card_state desc";

//            Log::info("findUserCards::query==>" . $query);
//            echo "$query\r\n";
            $this->logcommon(__METHOD__, [$query]);

            //return $query;
            return DB::select($query);
        } catch (\Exception $e) {
            $this->logWithException(__METHOD__, $e);
            return false;
        }
    }

    public function findUserPhones($loginUserId, $memberIds, $activate=true)
    {
        //return compact('loginUserId','memberIds');
        try {
            $query = "select cards.id,cards.card_sn,cards.card_state,cards.member_id,cards.buyer_id,cards.exchanger_id,cards.buy_at,cards.activate_at,cards.expire_date,";
            $query .= " members.name,members.phone,members.sex,members.faceurl,members.idcard from cards ";
            $query .= "left join members on cards.member_id = members.id ";

            //只有激活的卡片
            if ($activate) {
                $where = "where cards.card_state = 'activate' and cards.deleted_at is null and members.deleted_at is null and (";
            } else {
                //激活和已封的卡
                $where = "where cards.card_state != '0' and cards.deleted_at is null and members.deleted_at is null and (";
            }
            //========change-201611107-begin======
            //未兑换
            {
                if (count($memberIds) > 0) {
                    //未兑换,自己购买,或者自己激活的卡
                    $_memberIds = "(" . implode(",", $memberIds) . ")";
                    $where .= " ((cards.buyer_id = {$loginUserId} or cards.member_id in {$_memberIds}) and cards.exchanger_id <= 0)";
                } else {
                    //未兑换,自己购买
                    $where .= " (cards.buyer_id = {$loginUserId} and cards.exchanger_id <= 0)";
                }
            }


            //已兑换
            {
                //已兑换,别人购买,被自己兑换
                //$where .= " or (cards.exchanger_id = {$loginUserId} and cards.buyer_id > 0 and cards.buyer_id != {$loginUserId})";
                $where .= " or (cards.exchanger_id = {$loginUserId} and cards.buyer_id != {$loginUserId})";

                //已兑换,被别人兑换,用自己的手机号码激活的
                if (count($memberIds) > 0) {
                    $_memberIds = "(" . implode(",", $memberIds) . ")";
                    $where .= " or (cards.exchanger_id > 0 and cards.member_id in {$_memberIds}) ";
                }
            }
            //========change-201611107-end======

            $where .= ")";
            $query .= $where;

            //return $query;
            $this->logcommon(__METHOD__, [$query]);

            return DB::select($query);
        } catch (\Exception $e) {
            $this->logWithException(__METHOD__, $e);
            return false;
        }

    }

    public function batchCreate($cards)
    {
        try {
            $this->logcommon(__METHOD__, [$cards]);
            $result = [];
            foreach ($cards as $card) {
                $_card = Card::create($card);
                if ($_card) {
                    $result[] = $_card;
                } else {
                    return false;
                }
            }
            return $result;
        } catch (\Exception $e) {
            $this->logWithException(__METHOD__, $e);
            $this->sendIncStatsd("user.card.batchcreate.exception");
            return false;
        }
    }

    private function build_card_sn($prefix = '')
    {
        return $prefix . Str::random(16);
    }

    public function createCardSn()
    {
        $cardSn = $this->build_card_sn('tlnk');
        while (Card::where('card_sn', $cardSn)->count() > 0) {
            $cardSn = $this->build_card_sn('tlnk');
        }
        return $cardSn;
    }

    public function checkCardOwnerShip($loginUserId, $memberIds, $cardSn)
    {
        $card = $this->findByCardSn($cardSn);
        if ($card) {
            $isOwner = in_array($card->member_id, $memberIds) || $card->buyer_id = $loginUserId || $card->exchanger_id = $loginUserId;
            return $isOwner ? $card : false;
        }
        return false;
    }

    public function activateCard($cardSn, $phone, $name, $sex, $idCard, $photo, $platform_src)
    {
        $this->log(__METHOD__, [$cardSn, $phone, $name, $sex, $idCard, $photo, $platform_src]);
        $card = $this->findByCardSn($cardSn);
        if (!$card) {
            $this->sendIncStatsd('card.activateCard.nocard');
            return error_msg_response(ErrorCode::$ERROR_NoCard);
        }

        $memberData = [
            "name" => $name,
            "phone" => $phone,
            "idcard" => $idCard,
            "card_id" => $card->id,
            "sex" => $sex,
            "faceurl" => $photo,
            "extrainfo" => "",
            "platform_src" => $platform_src,
        ];
        try {
            return DB::transaction(function () use (&$card, $memberData) {

                //1.创建会员,2.关联年卡和会员
                $newMember = $this->memberRepo->create($memberData);

                //2.修改年卡有效期
                $card->member_id = $newMember->id;
                $card->card_state = 'activate';

                /* 取消三个月限制
                if ($card->source == 0) { //微信直接购买,或者转发,按指定规则计算有效期
                    $card->activate_at = Carbon::now();
                    if ($card->buy_at->diffInDays() <= 90) { //如果从购买日期三个月之内激活,则从激活时间开始计算有效期
                        $card->expire_date = $card->activate_at->copy()->addYears(1);
                    } else { //如果购买日期三个月之后激活,则从购买日期三个月开始计算有效期
                        $card->expire_date = $card->buy_at->copy()->addMonths(3)->addYears(1);
                    }
                } else { //线下兑换码兑换,从激活当天开始
                    $card->activate_at = Carbon::now();
                    $card->expire_date = $card->activate_at->copy()->addYears(1);
                }
                */

                //线上线下一律从激活当天开始
                $card->activate_at = Carbon::now();
                $card->expire_date = $card->activate_at->copy()->addYears(1);

                if (!$card->save()) {
                    $this->sendIncStatsd('user.card.activate.cardsave.failed');
                    $this->log(__METHOD__, ["status" => "cardsave:failed", "card" => $card]);
                }

                $this->dbLog(__METHOD__, compact('newMember', 'card'));
                return success_response(compact('newMember', 'card'));
            });
        } catch (\Exception $e) {
            $this->logWithException(__METHOD__, $e);
            $this->sendIncStatsd("user.card.activate.exception");
            return error_response(ErrorCode::$ERROR_EXCEPTION, "Exception", ["msg" => $e->getMessage()]);
        }
    }

    public function loggerName()
    {
        return "cardLogger";
    }
}
```

```js
var models = require('../models');
var memberservice = require('../service/memberservice'),
    enterlogService = require('../service/enterlogService'),
    tokenService = require('../service/tokenService'),
//client = require('../libs/statsd'),
    metricsutils = require('../libs/metricsutils'),
    systemConfig = require('../config/systemconfig.json');

var _ = require('lodash');
var express = require('express');
var router = express.Router();
var debug = require('debug')('ekatongcore');
var _request = require('request');
var utils = require('../libs/utils');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var ApiResponse = require('../libs/apiresponse');
var SystemConstants = require('../libs/systemconstants');

var YoutuImage = require('../libs/youtuimage'),
    infoLogger = require('../libs/logger').logger('log_info'),
    errorLogger = require('../libs/logger').logger('log_error'),
    enterLogger = require('../libs/logger').logger('log_enter');

var redisClient = require('../db/redisdb');
var enterLogRedisClient = require('../db/redisdb_enterlog');
var moment = require('moment'),
    Promise = require('bluebird'),
    _filter = require('../filter/tokencheck');

var tencentyoutuyun = require('../libs/tencentyoutuyun');
var conf = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;
var youtuConfig = require('../config/wx_youtu_config');

// var ekatongRpcClient = require('../libs/ekatongrpcclient');

// 设置开发者和应用信息, 请填写你在开放平台
var appid = youtuConfig.appid;
var secretId = youtuConfig.secretId;
var secretKey = youtuConfig.secretKey;
var userid = youtuConfig.userid;

conf.setAppInfo(appid, secretId, secretKey, userid, 0);

var co = require('co'),
    path = require('path'),
    aliOSS = require('../libs/alioss/index');

function randomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

router.post('/facecompare', _filter.tokenCheck, function (request, response) {
    //response.send(request.body);return;

    var timeStart = Date.now();

    enterLogger.debug("----facecompare.begin----");

    var _body = _.clone(request.body);
    delete _body.face;
    console.log("facecompare.request.body====>" + JSON.stringify(_body));

    //var tourid = request.headers.tourid || '0';
    // var deviceid = request.headers.deviceid || '0';
    var decodeToken = request.decodeToken;
    var tourid = decodeToken.tourid;
    console.info("decodeToken==>" + JSON.stringify(decodeToken));
    if (!tourid) {
        response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.ErrorToken));
        return;
    }

    var deviceid = request.body.deviceid || '0';
    var facedata = request.body.face || '0';//base64str
    var qrcode = request.body.qrcode || '0';
    var idcard = request.body.idcard || '0';
    var idcardinputtype = request.body.idcardinputtype || '0';
    var seqid = request.body.seqid || '0';

    //0:优图,1:手动
    var pictype = request.body.facetype || '0';

    //enterLogger.debug("request.body",request.body);

    console.log("step 1 , qrcode====>" + qrcode + ", seqid = " + seqid + ", idcard = " + idcard);

    if (deviceid == '4321') {
        var fakeCompareResult = {
            "httpcode": 200,
            "code": 200,
            "message": "HTTP OK",
            "data": {"session_id": "", "similarity": randomNum(80, 99), "errorcode": 0, "errormsg": "OK"}
        }
        response.send(ApiResponse.buildSuccessResponse(fakeCompareResult.data));

        sendMetrics("facecompare", "fakeInfo");
        return;
    }

    console.log("step 2,check params[facedata,deviceid]");
    if (facedata == '0' || deviceid == '0') {
        response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.MissParams, 'facedata,deviceid'));
        response.end();

        sendMetrics("facecompare" + "." + ApiResponse.Code.MissParams, "MissParams1");
        return;
    }

    console.log("step 3,check params[facedata,idcard]");
    if (qrcode == '0' && idcard == '0') {
        response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.MissParams, 'qrcode,idcard'));
        response.end();

        sendMetrics("facecompare" + "." + ApiResponse.Code.MissParams, "MissParam2");
        return;
    }

    console.log("step 4,check memberinfo");

    var _checkstatus = 'fail';
    var _memberInfo = null;
    var _cardsn = "";
    var _card = null;

    //console.log("md5facedata====>" + utils.md5(facedata));
    // if (qrcode.indexOf(systemConfig.prefix_qrcode, 0) != 0) {
    //     response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.InvalidQrcodeError));
    //     response.end();
    //     return;
    // }

    function simplyMemberInfo() {
        return _memberInfo ? {
            "memberid": _memberInfo.id,
            "name": _memberInfo.name,
            "sex": _memberInfo.sex,
            "idcard": _memberInfo.idcard,
        } : {};
    }

    console.info("systemConfig.check_policy:", systemConfig.check_policy);
    //如果身份证不为空,则身份证优先检查

    var idcard_switch = _.get(systemConfig, 'idcard_switch', 0);
    if (idcard_switch == 1 && idcard != '0') {
        memberservice.getMemberinfoByIdCard(idcard)
            .then(function (result) {
                _memberInfo = result.memberinfo;
                _card = result.cardinfo;
                _cardsn = _card.card_sn;

                return checkEnterLog(_memberInfo);
            })
            .then(function () {
                var data = {
                    "memberinfo": simplyMemberInfo()
                }

                var errorcode = ApiResponse.Code.OK.EnterByIdCard;
                var resp = ApiResponse.buildSuccessWithCodeResponse(errorcode, data);
                console.info("sendresp:", resp);
                response.send(resp);
                response.end();

                saveEnterlog(SystemConstants.Enter.CheckType.Wx.IdCard, SystemConstants.Enter.Similarity.IdCard.Matched, errorcode).catch(function () {
                });
                return;
            })
            .catch(function (err) {
                console.log("getMemberinfoByIdCard catch err==>" + err);
                enterLogger.error("getMemberinfoByIdCard failed:", err);

                var data = {
                    "memberinfo": simplyMemberInfo()
                }
                response.send(ApiResponse.buildErrorCodeResponseWithData(err, data));
                response.end();

                if (_.isNumber(err)) {
                    saveEnterlog(SystemConstants.Enter.CheckType.Wx.IdCard, SystemConstants.Enter.Similarity.IdCard.Mismatch, err).catch(function () {
                    });
                }
                sendMetrics("idcardcompare" + "." + ApiResponse.Code.Failed, "catchError1");
            });
        // .finally(function () {
        //     var responseTiming = Date.now() - timeStart;
        //     sendTimingMetrics('ekatong.facecompare.response', responseTiming, "");
        // });
        return;
    } else if (qrcode != '0') {

        if (qrcode.indexOf(systemConfig.prefix_qrcode, 0) != 0 || (qrcode.length != 24 && qrcode.length != 26)) {
            response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.InvalidQrcodeError));
            response.end();
            return;
        }

        //提取特征码,00为微官网,01为小程序
        var enterCode = ApiResponse.Code.OK.EnterByQrcode;
        var checkType = SystemConstants.Enter.CheckType.Wx.Qrcode;
        if (qrcode.length == 26) { //包含了两位特征码
            var fetureCode = qrcode.substr(8, 2);
            console.log("--fetureCode--", fetureCode);
            if (fetureCode == '00') { //微官网
                enterCode = ApiResponse.Code.OK.EnterByQrcode;
                checkType = SystemConstants.Enter.CheckType.Wx.Qrcode;
            } else if (fetureCode == '01') { //小程序
                enterCode = ApiResponse.Code.OK.WxApp.EnterByQrcode;
                checkType = SystemConstants.Enter.CheckType.WxApp.Qrcode;
            }
        }

        var next = getMemberinfoByQrcode(qrcode)
            .then(function (memberinfo) {
                //enterLogger.debug("facecompare::getmemberinfo",memberinfo);
                return checkEnterLog(memberinfo);
            }).then(function (memberinfo) {
                enterLogger.debug("入园方式:只采集数据,不做比对");
                var data = {
                    "memberinfo": simplyMemberInfo()
                }
                // var responseInfo = ApiResponse.buildSuccessWithCodeResponse(ApiResponse.Code.OK.EnterByQrcode, data);
                var responseInfo = ApiResponse.buildSuccessWithCodeResponse(enterCode, data);
                response.send(responseInfo);
                response.end();
                sendMetrics("facecompare" + "." + enterCode, "EnterByQrcode");
                sendMetrics("checktype" + "." + checkType, "CheckType");
                return saveEnterlog(checkType, SystemConstants.Enter.Similarity.Qrcode, enterCode);
            }).catch(function (err) {
                console.log("qrcode compare catch err==>" + err);
                enterLogger.error("qrcode compare failed:", err);

                var data = {
                    "memberinfo": simplyMemberInfo()
                }
                response.send(ApiResponse.buildErrorCodeResponseWithData(err, data));
                response.end();

                saveEnterlog(checkType, SystemConstants.Enter.Similarity.Qrcode, err).catch(function () {
                });

                sendMetrics("qrcodecompare" + "." + ApiResponse.Code.Failed, "catchError1");
            }).finally(function () {
                var responseTiming = Date.now() - timeStart;
                sendTimingMetrics('ekatong.facecompare.response', responseTiming, "");
            });
        return;
    }


    //以下代码后期再启用
    if (idcard != '0') { //身份证不为空,则只对比身份证,不做人脸对比
        next.then(function (memberinfo) {
            if (memberinfo.idcard != idcard) {
                var data = {
                    "memberinfo": simplyMemberInfo()
                }
                response.send(ApiResponse.buildErrorCodeResponseWithData(ApiResponse.Code.IdCardMissmatch, data));
                response.end();
                sendMetrics("facecompare" + "." + ApiResponse.Code.IdCardMissmatch, "IdCardMissmatch");
                // return saveEnterlogWhenUseIdCard(0);
                return saveEnterlog(1, 0, ApiResponse.Code.IdCardMissmatch);
            } else {
                var data = {
                    "memberinfo": simplyMemberInfo()
                }
                var responseInfo = ApiResponse.buildSuccessWithCodeResponse(ApiResponse.Code.OK.EnterByIdCard, data);
                response.send(responseInfo);
                response.end();
                sendMetrics("facecompare" + "." + ApiResponse.Code.OK.EnterByIdCard, "EnterByIdCard");

                console.log("response =>" + JSON.stringify(responseInfo));
                // return saveEnterlogWhenUseIdCard(100);
                return saveEnterlog(1, 100, ApiResponse.Code.OK.EnterByIdCard);
            }
        }).catch(function (err) {
            console.log("idcard compare catch err==>" + err);
            enterLogger.error("idcard compare failed:", err);

            sendMetrics("facecompare" + "." + ApiResponse.Code.Failed, "catchError1");
            response.send(ApiResponse.buildErrorCodeResponse(err));

            if (ApiResponse.Code.OutOfEnterCountOneTourToday == err) {
                saveEnterlog(2, 0, err).catch(function () {
                });
            }

        }).finally(function () {
            var responseTiming = Date.now() - timeStart;
            sendTimingMetrics('ekatong.facecompare.response', responseTiming, "");
        });
        ;
        return;
    }

    //身份证为空,则对比人脸
    next.then(function (memberinfo) {
        console.debug("check type:facecompare,step 0");
        return getfacedata(memberinfo);
    })
        .then(function (facedataInDB) {
            console.debug("check type:facecompare,step 1:facecompare");
            return facecompare(facedataInDB);
        })
        .then(function (compareResult) {
            console.debug("check type:facecompare,step 2:compareResult", compareResult);
            enterLogger.debug("人脸比对结果:", compareResult);

            var errorCode = -100;

            if (!_.has(compareResult, "data.similarity") || compareResult.data.similarity < systemConfig.threshold.enter_success) {
                errorCode = ApiResponse.Code.FaceMismatch;
                response.send(ApiResponse.buildErrorCodeResponse(ApiResponse.Code.FaceMismatch));
                sendMetrics("facecompare" + "." + ApiResponse.Code.FaceMismatch, "FaceMismatch");
            } else {
                errorCode = ApiResponse.Code.OK.EnterByFace;

                compareResult.data.memberinfo = simplyMemberInfo();
                var responseInfo = ApiResponse.buildSuccessWithCodeResponse(ApiResponse.Code.OK.EnterByFace, compareResult.data);
                response.send(responseInfo);
                console.log("response =>" + JSON.stringify(responseInfo));
                sendMetrics("facecompare" + "." + ApiResponse.Code.OK.EnterByFace, "EnterByFace");
            }
            response.end();

            return saveEnterlog(0, _checkstatus, errorCode);
        })
        .catch(function (err) {
            console.log("catch err==>" + err);
            enterLogger.error("facecompare failed:", err);

            response.send(ApiResponse.buildErrorCodeResponse(err));
            sendMetrics("facecompare" + "." + ApiResponse.Code.Failed, "catchError2");
        })
        .finally(function () {
            var responseTiming = Date.now() - timeStart;
            sendTimingMetrics('facecompare.response', responseTiming, "");
        });

    function getMemberinfoByQrcode(qrcode) {
        return new Promise(function (resolve, reject) {
            memberservice.getMemberinfoByQrcode(qrcode, function (result) {
                _cardsn = result.data.cardsn;
                //console.log("memberservice.getmemberinfo.memberinfo",result.data.member);
                //console.log("memberservice.getmemberinfo.card",result.data.card);
                if (result.status === 'success') {
                    _memberInfo = result.data.member;
                    _card = result.data.card;
                    resolve(result.data.member);
                } else {
                    console.log("facecompare::getmemberinfo", "getmemberinfo failed:" + result.message);
                    sendMetrics("facecompare", "GetMemberinfoFailed");
                    reject(result.message);
                }
            });
        });
    }

    function checkEnterLog(memberinfo) {
        return new Promise(function (resolve, reject) {

            var enter_count_limit = _.get(systemConfig, 'enter_count_limit', true);
            console.info("enter_count_limit:", enter_count_limit);
            if (!enter_count_limit) {
                resolve(memberinfo);
                return;
            }

            var enterLogCacheKey = "enterlog:memberid:" + memberinfo.id + ":tourid:" + tourid;
            enterLogRedisClient.existsAsync(enterLogCacheKey)
                .then(function (exists) {
                    enterLogger.debug("facecompare::checkEnterLog", {'existsEnterLog': exists});
                    if (exists) {
                        reject(ApiResponse.Code.OutOfEnterCountOneTourToday);
                        sendMetrics("facecompare", "OutOfEnterCountOneTourToday");
                    } else {
                        resolve(memberinfo);
                    }
                })
                .catch(function (err) {
                    enterLogger.error("facecompare::checkEnterLog", {'err': err});
                    sendMetrics("facecompare", "OutOfEnterCountOneTourToday");
                    reject(ApiResponse.Code.OutOfEnterCountOneTourToday);
                });
        })
    }

    var _faceUrl = "";

    function getfacedata(memberinfo) {
        return new Promise(function (resolve, reject) {
            var faceurl = memberinfo.faceurl;
            _faceUrl = faceurl;
            enterLogger.debug("facecompare::getfacedata", {"faceurl": faceurl});
            _request(faceurl, {'encoding': null}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log('success');
                    var base64Body = new Buffer(body).toString('base64');
                    // console.log("body====>" + base64Body);
                    // console.log("md5body====>" + utils.md5(base64Body));
                    resolve(base64Body);
                    sendMetrics("facecompare", "GetfacedataError");
                } else {
                    reject(ApiResponse.Code.FaceDataError);
                }
            })
        })
    }

    var _faceCompareResult;

    function facecompare(facedataInDB) {
        return new Promise(function (resolve, reject) {
            var compareStart = Date.now();

            enterLogger.debug("facecompare::facecompare", "start...");
            youtu.facecompare_base64(facedataInDB, facedata, function (data) {
                _faceCompareResult = data;
                enterLogger.debug("facecompare::facecompare", {'result': data});
                // _checkstatus = JSON.stringify(data);
                _checkstatus = data.data.similarity;
                resolve(data);

                var compareTiming = Date.now() - compareStart;
                sendTimingMetrics('facecompare.timing', compareTiming, "");
            })
        });
    }

    var _faceFile = "";

    function buildFacePath() {
        var appPath = path.join(__dirname, '..');
        var subPath = moment().format('YYYYMMDDHH');
        var faceDir = path.join(appPath, 'public/resource/face/', subPath);
        var faceFile = path.join(faceDir, utils.md5(facedata) + ".jpg");
        return {faceFile: faceFile, facedir: faceDir};
    }

    function uploadFace2Aliyun() {
        return new Promise(function (resolve, reject) {

            var pathInfo = buildFacePath();

            console.info("pathInfo==>" + JSON.stringify(pathInfo));

            faceFile = pathInfo.faceFile;
            faceDir = pathInfo.facedir;

            enterLogger.debug("facecompare::saveEnterlog::uploadFace2Aliyun", {"faceFile": faceFile});

            mkdirp(faceDir, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    if (utils.base64_decode(facedata, faceFile)) {
                        co(function*() {
                            var result = yield aliOSS.uploadUserFace(faceFile);
                            // console.info("uploadUserFace=>" + JSON.stringify(result));
                            resolve(result);
                        }).catch(function (err) {
                            console.info("uploadUserFace error:", err);
                            reject(err);
                        });
                    } else {
                        enterLogger.error("facecompare::saveEnterlog::uploadFace2Aliyun", "decodeFile Failed");
                        reject(false);
                    }
                }
            });
        });
    }

    /*
     checkType: 0:人脸 1:身份证 2:微官网二维码数据采集方式 4:小程序二维码
     * */
    function saveEnterlog(checkType, similarity, errorcode) {
        console.info("--------saveEnterlog-------");
        return new Promise(function (resolve, reject) {
            if (_memberInfo) {
                console.info("saveEnterlog.memberInfo==>" + JSON.stringify(_memberInfo));
                uploadFace2Aliyun().then(function (uploadResult) {
                    //console.info("uploadFace2Aliyun().then==>" + uploadResult);
                    // enterLogger.info("facecompare::uploadFace2Aliyun", uploadResult);
                    if (uploadResult && uploadResult.url) {
                        var paramCheckStatus = 0;
                        if (checkType == 0) {
                            paramCheckStatus = _checkstatus;
                        } else if (checkType == 1 || checkType == 2) {
                            paramCheckStatus = similarity;
                        }
                        enterlogService.addYearMonthLog(
                            _memberInfo.id,
                            _cardsn,
                            tourid,
                            deviceid,
                            paramCheckStatus,
                            uploadResult.url,
                            idcard,
                            checkType,
                            pictype,
                            errorcode,
                            idcardinputtype,
                            0,
                            function (result) {
                                console.log(result);
                            }
                        );
                    }
                    resolve();
                }).catch(function (err) {
                    resolve(err);
                })
            } else {
                reject(ApiResponse.Code.MemberInfoNotFound);
            }
        });
    }

    function sendMetrics(metricsname, fieldValue) {
        metricsutils.sendAllIncMetrics(metricsname, fieldValue);
    }

    function sendTimingMetrics(metricsname, metricsvalue, fieldValue) {
        metricsutils.sendAllTimingMetrics(metricsname, metricsvalue, fieldValue);
    }
});

module.exports = router;
```