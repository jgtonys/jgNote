### 깃헙 이슈에 이미지 올리기



사전 준비사항 : https://github.com/nhn/tui.editor/wiki/Getting-Started-Korean (Tui editor 에서 이미지를 올릴 때 hook 을 사용하여 이미지 업로드 로직을 커스터마이징하기로 한다)



*javascript 에서 editorOptions 에 customize hook 생성 (이름은 addImageBlobHook)*

```javascirpt
editorOptions: {
        hideModeSwitch: false,
        usageStatistics: false,
        hooks: {
          'addImageBlobHook': (blob, callback) => {
            //var uploadedImageURL = that.imageUpload(blob);
            var uploadedImageURL = this.test(blob);
            callback(uploadedImageURL);
            return false;
              //run callback
              //callback('Image URL');
         	}
      	},
 },
```



*editor 에 적용*

```html
<editor :options="editorOptions" :html="editorHtml" :visible="editorVisible" previewStyle="tab" height="500px" mode="markdown" v-model="content_text" />
```



참고자료

https://gist.github.com/maxisam/5c6ec10cc4146adce05d62f553c5062f

https://github.com/axios/axios/issues/1769

https://gist.github.com/JeffPaine/3145490

https://developer.github.com/v3/issues/#custom-media-types



(콜백)

https://codevkr.tistory.com/54

https://simon-schraeder.de/posts/filereader-async/



1. 깃헙 repo 의 personal access token을 생성한다
   - 먼저 `https://github.com/settings/tokens` 에서 새로운 토큰을 생성하고 scope select 에서 public_repo 를 선택한다.
     ![1561988878588](C:\Users\Jungyu Kim\AppData\Roaming\Typora\typora-user-images\1561988878588.png)
   - 99b895e71a6ff4205debaa0251a13bdfe9517fb4