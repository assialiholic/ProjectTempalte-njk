# コーディングルール
## 基本ルール
基本的に[24-7基本ルール](https://goo.gl/Q8U45N)に準ずる。
## 命名規則
[PRECSS](http://precss.io/ja/)を使用。

# 主なgulpタスク
- gulp - ファイル監視・ローカルサーバー起動・コンパイル・エラーチェックを自動で行う開発用のタスクです。
- gulp check - SassファイルのCSS comb、HTMLのバリデーションを行います。**Gitへのコミット前に必ず実行し、バリデーションエラーは極力解消するようにしてください。**

# Sass情報
なるべくセマンティックな値は変数化し、既存mixin/functionを活用するようにしてください。

## 変数
変数は全て_vars.scssにまとめています。大まかに下記のセクションに分かれています。

- 基本設定（パス・サイト幅等）
- 色
- **余白** - セクションの上下の余白や、各モジュールに共通する余白を管理しています。新たにセクションやモジュールを作る際はこちらの変数を使用してください。（変数が作成されていない、かつサイト全体に渡り法則性のある値は新たに作成してください）
- **テキスト** - テキストに関しても、基本的に変数値を使用してください。**またSPビュー時は必ず「sp_」の接頭辞のついた変数を使用してください。**
- ボーダー
- ボックス

## mixin
開発時間の短縮、また品質の管理のためにMixinの積極的な使用を推奨します**（特に品質管理のものは、必ず使用するようにしてください）**。  
使用方法は以下の通りです。

### FHA（品質管理）
focus, hover, active時の挙動を一括指定します。

```scss
a {
  background-color: #000;
  @include FHA {
    background-color: #fff;
  }
}
↓
a {
  background-color: #000;
}
a:focus,
a:hover,
a:active {
  background-color: #fff;
}
```

### MQ（品質管理）
メディアクエリの省略記法です。引数には_vars.scssに定義されている文字列が入ります。
```scss
.hoge {
  width: 100%
  @include MQ(sm){
    width: 50%;
  }
}
↓
.hoge {
  width: 100%
}
@media screen and (max-width: 750px){
  .hoge {
    width: 50%
  }
}
```

### contentCentering（品質管理）
コンテンツをセンタリングし、かつサイト幅制限や左右に余白を持たせる処理も加えます。処理内容はコードを確認してください。
```scss
@mixin contentCentering(){
  max-width: $contWidth;
  padding-right: $contSpace;
  padding-left: $contSpace;
  margin-right: auto;
  margin-left: auto;
  @include MQ(md) {
    max-width: 100%;
  }
}
```

### basicTxt（品質管理）
テキストの基本スタイルを定義したものです。あまり使うことは無いと思いますが、どこかカスケード中に基本スタイルにリセットしたい場合は有用です。
```scss
@mixin basicTxt($lh: $lh){
  color: $txtColor;
  font-family: $ff__sans;
  font-size: $fz;
  font-weight: $fw;
  line-height: $lh;
  @include MQ(sm){
    font-size: $sp_fz;
    line-height: $sp_lh;
  }
}
```

### lastPR0（開発効率）
末尾の要素の余白を打ち消します。他にbottomを打ち消すもの、margin用のものがあります。
```scss
@mixin lastPR0(){
  > *:last-child {
    padding-right: 0!important;
  }
}

@mixin lastPB0(){
  > *:last-child {
    padding-bottom: 0!important;
  }
}

@mixin lastMR0(){
  > *:last-child {
    margin-right: 0!important;
  }
}

@mixin lastMB0(){
  > *:last-child {
    margin-bottom: 0!important;
  }
}
```

## function
mixinと比較すると、値だけを返すものが主です。一見難解ですが使い方を覚えると品質・開発効率両面の向上が図れます。**特にautoSpaceは積極的に使用するようにしてください。**

### percentToCont
第一引数に値を入れると、サイト幅に対する%が自動的に算出されます。第二引数には分母となる値を入れます（デフォルトでサイト幅が入っているため、サイト幅の場合は省略可能です）。

```scss
.hoge {
  width: percentToCont(540); //サイト幅が1080の場合
  ↓
  width: 50%;
}
```

### totalPadHeight
主にpadding-top・padding-bottomに使用します。第一引数に要素が最終的に取って欲しい高さを入れると、自動的にその高さになるようpadding値を算出します。  
第二・第三引数にはそれぞれfont-size・line-heightを渡します（デフォルト値の場合は省略可能）。

```scss
.hoge {
  padding: totalPadHeight(50) 20px; //自動的に高さが約50pxになる
}
```


### autoSpace
テキストのline-height値を自動的に差し引いた余白値を算出します。**つまり、デザインとほぼ全く同じ余白を簡単に再現出来るということです。**  
デフォルト値で良い場合は引数は省略可能です。

- 第一引数 - 見た目上最終的に空いて欲しい値（デザイン上の値）
- 第二引数 - font-size値（デフォルト：$fz）
- 第三引数 - line-height値（デフォルト：$lh）

```scss
.hoge{
  //font-size:15px, line-height:1.8とする
  margin-bottom: autoSpace(35);
}
↓
.hoge{
  margin-bottom: 29px;
  /* 
    下部の余計なline-height（(15 * 1.8 - 15) / 2 = 6px）の分
    を引いているため、line-heightと合わせると見た目上ピッタリ35pxになる。
  */
}
```

### sp_autoSpace
autoSpaceの$fz・$lhのデフォルト値にspのデフォルト値を渡したものです。sp時はこちらを使用することにより、第二・第三引数を省略できるため開発効率が上がります。

- 第一引数 - 見た目上最終的に空いて欲しい値（デザイン上の値）
- 第二引数 - font-size値（デフォルト：$sp_fz）
- 第三引数 - line-height値（デフォルト：$sp_lh）

```scss
.hoge{
  margin-bottom: sp_autoSpace(35);
}
```

### autoSpace2
autoSpaceを使用した後続に更にテキスト要素が続く場合、こちらを使用することにより後続テキストのline-heightも考慮した値を算出します。

- 第一引数 - 見た目上最終的に空いて欲しい値（デザイン上の値）
- 第二引数 - font-size値（デフォルト：$fz）
- 第三引数 - 後続テキストのfont-size値（デフォルト：$fz）
- 第四引数 - line-height値（デフォルト：$lh）
- 第五引数 - 後続テキストのline-height値（デフォルト：$lh）

```scss
//h2の後にh3が続く場合
h2{
  margin-bottom: autoSpace2(35, $fz__h2, $fz__h3);
}
```

### sp_autoSpace2
autoSpace2のsp版です。

- 第一引数 - 見た目上最終的に空いて欲しい値（デザイン上の値）
- 第二引数 - font-size値（デフォルト：$sp_fz）
- 第三引数 - 後続テキストのfont-size値（デフォルト：$sp_fz）
- 第四引数 - line-height値（デフォルト：$sp_lh）
- 第五引数 - 後続テキストのline-height値（デフォルト：$sp_lh）

```scss
//h2の後にh3が続く場合
h2{
  margin-bottom: autoSpace2(35, $fz__h2, $fz__h3);
  @include MQ(md) {
    margin-bottom: sp_autoSpace2(35, $sp_fz__h2, $sp_fz__h3);
  }
}

```

### halfLeading
halfLeadingを算出します。

- 第二引数 - font-size値（デフォルト：$fz）
- 第四引数 - line-height値（デフォルト：$lh）

```scss
.hoge {
  margin-top: - halfLeading(); //上部のhalfLeadingをネガティブマージンで打ち消す例
}

```
