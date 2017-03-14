



## 问题：
* APP model 的 unique index 加不上
    * 首先, 配置 mongoose 的schema， 这个 unique index 怎么加，不管跑测试还是正常启动应用，都会成功绕过unique限制
    * 其次，在app资源创建的endpoint中，我已经用代码explicitly检查对应name的app资源有没有创建，在functional test中都会绕过这个代码的检查，这一部分的问题，估计是短时间内请求并发问题导致的。在endpoint中的代码出现了脏读，解决这个问题，最根本的方式就是从数据库这一端正常加上 unique index 的限制。

