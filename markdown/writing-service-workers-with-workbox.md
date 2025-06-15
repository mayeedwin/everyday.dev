# Why workbox though?

**Service workers** provide the door to writing offline-first capabilities as the base feature. Bottom line, they sit as a proxy between web browsers and web servers. Workbox libraries and tools allows you to build robust service workers quicker than ever!

## What you need to know about caching

When thinking about caching, there are key questions you need to answer first.

- **What** to cache?
- **When** to cache?
- How **much** to cache?
- How **long** to cache?
- And the most important ONE, how **fresh** do you need the resources to be?

Workbox provides different ways to handle resources with the cache; **caching strategies**. Answering the above questions would really help you to decide what strategy works best for your awesome web application

### 1. Cache only

This is when you basically have **precached resources** and an array of these precached items. Simply this means, when a request is made, if the resource is in the list, we would always have it from the cache, the rest of the resources are always network fetched! Best for resources whose freshness does not really matter.

### 2. Network only

This is when you always want **fresh resources**! Basically the opposite of cache-only! The cache is bypassed! We would say, for e.g a live feed of some sort? Maybe a news feed?

### 3. Cache first

This works best when you want to check if a resource is in the **cache** before attempting to go to the network. If **network-fetched**, once finished, add it to the cache! An example would be a news article page.

### 4. Network first

Basically the opposite of the **cache-first**. You go to the network for the resource, then add it to the cache, if offline later on, we fall back to the cache. Probably a social app, like X would be an example.

### 5. Stale-while-revalidate

Ideally, this is a **hybrid** of **cache-first** and **network-first**. On the first request of a resource, we go "**network-first**" but there is a twist, where then it becomes **cache-first** on subsequent requests of the resource while updating the cached resource in the background with the freshest version.

It prioritizes **speed of access for a resource**, while also keeping it **up to date in the background**. Best for resources that are somewhat important to keep up-to-date but not crucial.

To get started with [workbox](https://developer.chrome.com/docs/workbox) and how to use it, check out the [official documentation here](https://developer.chrome.com/docs/workbox).
