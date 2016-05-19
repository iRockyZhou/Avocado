#Avocado

> Avocado is a project management tool for the construction of front-end project.

## Requirements
 - Node.js
 - bash

## Feature
 - Compress your code & images, save your traffic.
 - Detection of your code, to more secure deployment.
 - Better use of CDN, and painless solution to the browser cache problem.
 - Real time preview of your code, the more cool development experience.
 - One key to deploy your code to Aliyun, you can use the saved time to chasing a girl friend.

## Installation

Install package with NPM and add it to your development dependencies:

`npm i`
 
If your computer is not over the wall, please install [CNPM](http://npm.taobao.org/) and use the following command.

`cnpm i`
 
## Structure

|-- src/  
&emsp;&emsp;|-- index.html  
&emsp;&emsp;|-- html/  
&emsp;&emsp;|-- css/  
&emsp;&emsp;|-- js/  
&emsp;&emsp;&emsp;&emsp;|-- lib/  
|-- dist/  
&emsp;&emsp;|-- index.html  
&emsp;&emsp;|-- html/  
&emsp;&emsp;|-- css/  
&emsp;&emsp;|-- js/  
&emsp;&emsp;&emsp;&emsp;|-- lib/  
|-- cdn/  
&emsp;&emsp;|-- index.ce5e9aa6.html  
&emsp;&emsp;|-- html/  
&emsp;&emsp;|-- css/  
&emsp;&emsp;|-- js/  
&emsp;&emsp;&emsp;&emsp;|-- lib/  
|-- node_modules/  
...

## Config

```javascript
var paths = {
  src: {
    index: 'src/html',
    src: 'src/',
    html: 'src/html/',
    js: 'src/js/',
    css: 'src/css/',
    images: 'src/images/',
    lib: 'src/js/lib/'
  },
  dist: {
    index: 'dist/html',
    dist: 'dist/',
    html: 'dist/html/',
    js: 'dist/js/',
    css: 'dist/css/',
    images: 'dist/images/',
    lib: 'dist/js/lib/'
  }
};

var ossOptions = {
  accessKeyId: '**********',
  secretAccessKey: '*********',
  endpoint: 'http://oss-******.aliyuncs.com',
  apiVersion: '2013-10-15',
  prefix: 'YOUR SITE PREFIX',
  bucket: 'YOUR BUCKET NAME'
};
```

## Usage

Just develop  
`gulp dev`

Build to dist  
`gulp build`

Release your project  
`gulp release`