<img class="aligncenter size-full wp-image-288" src="https://blog.mehraban.com.au/wp-content/uploads/2018/01/logo.png" alt="" width="381" height="85" />

Are you working on an international product where you need to support multiple languages? Is your application written in Angular? Then this article might help you to get it done easier than ever.

We will use a small application since the purpose here is to show you how easy you can another language to your application. So let's get started.

Full source code of this example is available on my GitHub.
<h2>Prerequisites</h2>
You will need to have node, npm and <a href="https://github.com/angular/angular-cli">Angular CLI</a> installed before going further.
<h2>Creating the application</h2>
Let's start by creating a new application using <a href="https://github.com/angular/angular-cli">Angular CLI</a>:
<pre class="lang:js decode:true">ng new demo --skip-install</pre>
We use <code>--skip-install</code> flag to prevent installing the node modules as we intend to add <strong>ngx-translate</strong> to our <code>package.json</code> shortly.

Let's do that next:
<pre class="lang:js decode:true">npm install @ngx-translate/core @ngx-translate/http-loader --save</pre>
I added the <code>http-loader</code> just because I've created some <code>json</code> files containing the translations which I want to fetch. This simulates some real time translation such as using a <em>RESTful</em> translation service. You will get some warnings from <code>npm</code> but don't worry, go ahead and run <code>npm install</code> to install all the required packages for the application.
<h2>Importing the translation module</h2>
Let's open up our <code>app.module.ts</code> and import the <code>TranslateModule</code>.

This module requires a loader which is the <code>TranslationHttpLoader</code> we added earlier. But before doing so we need a way to create it since it has a dependency on <code>HttpClient</code>.

There are multiple ways to achieve this, but we use a factory method just because you will need and exported function for <a href="https://angular.io/docs/ts/latest/cookbook/aot-compiler.html">AoT compilation</a> or if you are using <a href="http://ionic.io/">Ionic</a>:
<pre class="lang:js decode:true">import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})</pre>
The loader can load the translation files using <code>http</code>.
<h2>Adding the translation service</h2>
OK, we need the <code>TranslateService</code> to be able to make our template multi-lingual. Also we need to add our translation files for different languages we want to use.

First let's import the service. Open your <code>app.component.ts</code> and insert this line on top:
<pre class="lang:js decode:true">import { TranslateService } from '@ngx-translate/core';</pre>
Now we need to define our default language, which we will do inside the constructor:
<pre class="lang:js decode:true">constructor(private translateService: TranslateService) {
  translateService.setDefaultLang('en');
}</pre>
I'll use two languages here but the process is the same and adding a third one as simple as adding a file containing the translated text. These files would be put into <code>assets/i18n</code> folder.

First English file in <code>src/assets/i18n/en.json</code>:
<pre class="lang:js decode:true">{
    "Title": "Translation demo",
    "WelcomeMessage": "Welcome to the international demo application"
}</pre>
And Spanish in <code>src/assets/i18n/es.json</code>:
<pre class="lang:js decode:true">{
    "Title": "Demo de traducción",
    "WelcomeMessage": "Bienvenido a la aplicación de demostración internacional"
}</pre>
These files will be loaded using our translation loader that we added to the translation module. Now we can go ahead and create our template. We use the translate directive to tell the translate service which part of the template should be replaced.

Note: If you use the translate pipe, it expects nothing but the variable name inside the tag, so if you add other text it won't pick it up.
<pre class="lang:xhtml decode:true">&lt;h1 translate&gt;Title&lt;/h1&gt;

&lt;div translate&gt;WelcomeMessage&lt;/div&gt;</pre>
There is nothing fancy in there, just using the variables in those <code>json</code> files and adding the translate attribute so that Angular know how these should be fetched using translation loader.

We need one more thing to setup and that is our language switcher. Let's for now keep it simple and add two buttons there which will call a function to switch between these languages, your final template would be something like this:
<pre class="lang:xhtml decode:true">&lt;div style="text-align:center"&gt;
  &lt;h1 translate&gt;Title&lt;/h1&gt;

  &lt;h6 translate&gt;WelcomeMessage&lt;/h6&gt;

  &lt;button (click)="switchLanguage('en')"&gt;English&lt;/button&gt;

  &lt;button (click)="switchLanguage('es')"&gt;Spanish&lt;/button&gt;
&lt;/div&gt;</pre>
and now defining the <code>switchLanguage</code> method:
<pre class="lang:js decode:true">switchLanguage(language: string) {
  this.translateService.use(language);
}</pre>
Remember that we injected our service into the constructor.
<h2>First test</h2>
Let's run the app and see what happens, just type <code>ng serve</code> and open up <code>http://localhost:4200</code> in the browser. You will see the home page:

<img class="alignnone size-medium wp-image-295" src="https://blog.mehraban.com.au/wp-content/uploads/2018/01/en-300x132.png" alt="" width="300" height="132" />

If you click on Spanish button the page will change to this:

<img class="alignnone size-medium wp-image-296" src="https://blog.mehraban.com.au/wp-content/uploads/2018/01/es-300x126.png" alt="" width="300" height="126" />

Let's go ahead and change the button texts as well. This time we use inline template with the <code>translate</code> pipe. First we add the two labels to the <code>json</code> files.

For English:
<pre class="lang:js decode:true">{
    "Title": "Translation demo",
    "WelcomeMessage": "Welcome to the international demo application",
    "English": "English",
    "Spanish": "Spanish"
}</pre>
And for Spanish:
<pre class="lang:js decode:true">{
    "Title": "Demo de traducción",
    "WelcomeMessage": "Bienvenido a la aplicación de demostración internacional",
    "English": "Inglés",
    "Spanish": "Español"
}</pre>
Finally we change the buttons in the template to use these labels:
<pre class="lang:xhtml decode:true">&lt;button (click)="switchLanguage('en')"&gt;{{ 'English' | translate }}&lt;/button&gt;

&lt;button (click)="switchLanguage('es')"&gt;{{ 'Spanish' | translate }}&lt;/button&gt;</pre>
Now the application should have hot reloaded and you should see the first picture. But if you click on Spanish you should see the buttons change:

<img class="alignnone size-medium wp-image-297" src="https://blog.mehraban.com.au/wp-content/uploads/2018/01/es-1-300x134.png" alt="" width="300" height="134" />
<h2>Passing variables to translate service</h2>
You can pass your component variables to the translate pipe to be able to format your strings in those <code>json</code> files. The simplest form is to show the welcome message for the user by having his/her name in the message.

We will first change our jsons to have the user name in the message:
<pre class="lang:js decode:true">{
    "Title": "Translation demo",
    "WelcomeMessage": "Dear {{name}}, welcome to the international demo application",
    "English": "English",
    "Spanish": "Spanish"
}</pre>
And for Spanish:
<pre class="lang:js decode:true">{
    "Title": "Demo de traducción",
    "WelcomeMessage": "Querido {{name}}, bienvenido a la aplicación de demostración internacional",
    "English": "Inglés",
    "Spanish": "Español"
}</pre>
Now let's define the user in our <code>app.component.ts</code>.
<pre class="lang:js decode:true">let user: any = {
  name: Yaser
};</pre>
Finally, we need to pass this to the pipe:
<pre class="lang:xhtml decode:true">&lt;h6&gt;{{ 'WelcomeMessage' | translate: user }}&lt;/h6&gt;</pre>
Now you should be able to see the my name in the welcome message.
<h2>Custom loaders</h2>
You can even write your own loaders and use a third party service for translation. It is very easy to do that, in fact all you need to do is to create a class which extends the TranslateLoader and then add a method called <code>getTranslation</code>:
<pre class="lang:js decode:true ">class CustomLoader implements TranslateLoader {
    getTranslation(lang: string): Observable&lt;any&gt; {
        return Observable.of({KEY: 'value'});
    }
}</pre>
Now you can use this instead of that factory method we created earlier in your <code>app.module.ts</code>.
<pre class="lang:js decode:true ">@NgModule({
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useClass: CustomLoader}
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }</pre>
Hope this article has helped you to get started with the <code>ngx-traslate</code> package. For more information you can refer to <a href="https://github.com/ngx-translate/core">their official documentation</a>.