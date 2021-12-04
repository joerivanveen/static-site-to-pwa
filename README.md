# static-site-to-pwa
Make a pwa from any (large) static site. Sponsored by CTA Group.

This little project makes it possible to offer your visitors the ability to save specific parts of your website for offline use and access those parts easily from their phone. 

Contact me if you want me to customize and set this up for you.

## Easy deployment
The folder static-site-to-pwa contains everything you need to convert your static website to a functional pwa.

### Caveats:
- Currently every cached folder must be self containing (including needed css and js files)
- The indexing script is written in vb, so it probably only works on Windows for now

## How to make a pwa
1. Put the entire `pwa` folder in the root of your static website.
2. Put the file `serviceworker.js` also in the root.
3. Customize the `pwa/icons` and `pwa/manifest.webmanifest`.
4. Customize `pwa/front.js`, in the beginning of the file you can set some timeouts and translations.

To change the appearance of the pwa buttons, you can of course edit the file `pwa/buttons.css`.

### Changes to your static site
In addition to the above, the following changes need to be made to your static site:

1. In each folder you want a visitor to be able to save for offline use, add the (empty) file: `cache_this_folder.txt`.
2. (!) If you link to shared files in that folder (e.g. /css/my_style.css) a provision needs to be made yet.
3. All user accessible files need to have the script /pwa/front.js added. I suggest you search and replace all `</head>` tags

```
Search: </head>
Replace: <script src="/pwa/front.js?v=1.0.0" data-root="https://www.ruigehond.nl"></script>
```
Please note: The version parameter is mandatory. Data-root is also mandatory and must contain the correct protocol + domain + portnumber (not necessary when default) of your website, without trailing slash.

The `cache_this_folder.txt` file is mentioned in the `make_pwa.vbs` as a trigger for the download ability, you can change the name there if you want to use a different trigger file.

### Indexing your site for the pwa
Now drop the root folder of your static site on the `make_pwa.vbs` script. This will index your site and write `assets.js` to the pwa folder in it. Please wait for the confirmation.

Your site is now ready to be used as a pwa. Upload it and be amazed at the functionality.

## When updating your pwa
Every time you want to publish changes to your website, you need to update the pwa as well. Perform these steps before publishing:

1. Make sure the correct script (front.js) is present in all new files that will be served to the visitor.
2. Update the version string, e.g. search `/pwa/front.js?v=1.0.0` and replace with `/pwa/front.js?v=1.0.1`. You need to update the version in ALL the files.

(Re-)upload your entire site to the ftp location, not just the changes. This is necessary for the cache to be managed appropriately.

### Cool static pwa
When you change the name or location of a folder that is cached, this will invalidate the cache and after a version bump it will be removed from any client that saved it.
When you change contents in a folder, the version update will update the contents in the cache automatically for visitors that saved it (when they are online).

