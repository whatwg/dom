This repository hosts the [DOM Standard](https://dom.spec.whatwg.org/).

## Code of conduct

We are committed to providing a friendly, safe, and welcoming environment for all. Please read and respect the [Code of Conduct](https://whatwg.org/code-of-conduct).

## Contribution opportunities

Folks notice minor and larger issues with the DOM Standard all the time and we'd love your help fixing those. Pull requests for typographical and grammar errors are also most welcome.

Issues labeled ["good first issue"](https://github.com/whatwg/dom/labels/good%20first%20issue) are a good place to get a taste for editing the DOM Standard. Note that we don't assign issues and there's no reason to ask for availability either, just provide a pull request.

If you are thinking of suggesting a new feature, read through the [FAQ](https://whatwg.org/faq) and [Working Mode](https://whatwg.org/working-mode) documents to get yourself familiarized with the process.

We'd be happy to help you with all of this [on Chat](https://whatwg.org/chat).

## Pull requests

In short, change `dom.bs` and submit your patch, with a [good commit message](https://github.com/whatwg/meta/blob/main/COMMITTING.md).

Please add your name to the Acknowledgments section in your first pull request, even for trivial fixes. The names are sorted lexicographically.

To ensure your patch meets all the necessary requirements, please also see the [Contributor Guidelines](https://github.com/whatwg/meta/blob/main/CONTRIBUTING.md). Editors of the DOM Standard are expected to follow the [Maintainer Guidelines](https://github.com/whatwg/meta/blob/main/MAINTAINERS.md).

## Tests

Tests are an essential part of the standardization process and will need to be created or adjusted as changes to the standard are made. Tests for the DOM Standard can be found in the `dom/` directory of [`web-platform-tests/wpt`](https://github.com/web-platform-tests/wpt).

A dashboard showing the tests running against browser engines can be seen at [wpt.fyi/results/dom](https://wpt.fyi/results/dom).

## Building "locally"

For quick local iteration, run `make`; this will use a web service to build the standard, so that you don't have to install anything. See more in the [Contributor Guidelines](https://github.com/whatwg/meta/blob/main/CONTRIBUTING.md#building).

## Formatting

Use a column width of 100 characters.

Do not use newlines inside "inline" elements, even if that means exceeding the column width requirement.
```html
<p>The
<dfn method for=DOMTokenList lt=remove(tokens)|remove()><code>remove(<var>tokens</var>&hellip;)</code></dfn>
method, when invoked, must run these steps:
```
is okay and
  ```html
<p>The <dfn method for=DOMTokenList
lt=remove(tokens)|remove()><code>remove(<var>tokens</var>&hellip;)</code></dfn> method, when
invoked, must run these steps:
```
is not.

Using newlines between "inline" element tag names and their content is also forbidden. (This actually alters the content, by adding spaces.) That is
```html
<a>token</a>
```
is fine and
```html
<a>token
</a>
```
is not.

An `<li>` element always has a `<p>` element inside it, unless it's a child of `<ul class=brief>`.

If a "block" element contains a single "block" element, do not put it on a newline.

Do not indent for anything except a new "block" element. For instance
```html
 <li><p>For each <var>token</var> in <var>tokens</var>, in given order, that is not in
 <a>tokens</a>, append <var>token</var> to <a>tokens</a>.
```
is not indented, but
```html
<ol>
 <li>
  <p>For each <var>token</var> in <var>tokens</var>, run these substeps:

  <ol>
   <li><p>If <var>token</var> is the empty string, <a>throw</a> a {{SyntaxError}} exception.
```
is.

End tags may be included (if done consistently) and attributes may be quoted (using double quotes), though the prevalent theme is to omit end tags and not quote attributes (unless they contain a space).
