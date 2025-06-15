# Why workbox though?

**Service workers** provide the door to writing offline-first capabilities as the base feature. Bottom line, they sit as a proxy between web browsers and web servers. Workbox libraries and tools allows you to build robust service workers quicker than ever!

## What you need to know about caching

When thinking about offline-first, they are key questions you need to answer first.

- **_What_** to cache?
- **_When_** to cache?
- How **_much_** to cache?
- How **_frequent_** to cache?
- And the most important ONE, how **_fresh_** do you need the resources to be?

Workbox provides different to ways to handle resources with the cache; **caching strategies**. Answering the above questions would really help you to decide what strategy works best for your awesome web application

### 1. Cache only

This is when you basically have **_precached resources_** and an array of these precached items. Simply this means, when a request is made, if the resource is in the list, we would always have it from the cache, the rest of the resources are always network fetched!

### 2. Network only

This is when you always want **_fresh resources_**! Basically the opposite of cache-only! The cache is bypassed!

### 3. Cache first

This works best when you want to check if a resource is in the **_cache_** before attemping to got to the network. If **_network-fetched_**, once finished, add it to the cache!

### 4. Network first

Basically the opposite of the **_cache-first_**. You got to the network for the resource, then add it to the cache, if offline later on, we fall back to the cache.

### 5. Stale-while-revalidate

Ideally, this is a **_hybrid_** of **_cache-first_** and **_network-first_**. On the first request of a resource, we got "**_network-first_**" but there is a twist, where then it becomes **_cache-first_** on subsequent requests of the resource while updating the cached resource in the background with freshest version.

It prioritizes **_speed of access for a resource_**, while also keeping it **_up to date in the background_**. Best for resources that are somewhat important to keep upto-date but not crucial.

### Get staaaaaaaarted

Now that you have a quick understanding; if not - re-read; LOL! - anyways, get started with [workbox here](https://developer.chrome.com/docs/workbox)
