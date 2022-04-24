# Run Locally

Please create next file in you local directory

```./apify_storage/key_value_stores/default/INPUT.json```

With content like this

```
{
    "baseUrl": "https://vk.com",
    "loginUsername": "<YOU_VK_USERNAME_OR_MOBILE_PHONE>",
    "loginPassword": "<YOU_VK_PASSWORD>",
    "startUrl": "<VK_PROFILE_PAGE_YOU_WANT_TO_START_FROM>",
    "maxCrawlingLevel": 1
}
```

Also,  in project root directory you can create file named ```.env``` to specify some scrapper parameters:

```
APIFY_LOG_LEVEL=DEBUG
APIFY_MEMORY_MBYTES=12192

VK_SCRAPPER_NO_PROXY=1
# VK_SCRAPPER_MAX_REQUESTS_PER_CRAWL=10
# VK_SCRAPPER_AUTOSCALED_POOL_CONCURRENCY=1
# VK_SCRAPPER_SESSION_MAX_POOL_SIZE=1
```

# PuppeteerCrawler project

This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
Use this to bootstrap your projects using the most up-to-date code.

If you're looking for examples or want to learn more visit:

- [Documentation](https://sdk.apify.com/docs/api/puppeteer-crawler)
- [Examples](https://sdk.apify.com/docs/examples/puppeteer-crawler)

## Documentation reference

- [Apify SDK](https://sdk.apify.com/)
- [Apify Actor documentation](https://docs.apify.com/actor)
- [Apify CLI](https://docs.apify.com/cli)

## Writing a README

See our tutorial on [writing READMEs for your actors](https://help.apify.com/en/articles/2912548-how-to-write-great-readme-for-your-actors) if you need more inspiration.

### Table of contents

If your README requires a table of contents, use the template below and make sure to keep the `<!-- toc start -->` and `<!-- toc end -->` markers.

<!-- toc start -->
- Introduction
- Use Cases
  - Case 1
  - Case 2
- Input
- Output
- Miscellaneous
 <!-- toc end -->
