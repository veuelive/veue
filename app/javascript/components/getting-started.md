# Purpose

Web Components!

## How do I use this?

### Whats here?

`lit-element` and `lit-html` are the 2 main libraries for web
components. Everything else is just for testing / development purposes.

Other Libraries:

[@web/test-runner](https://modern-web.dev/docs/test-runner/overview/)

[@open-wc/testing](https://open-wc.org/docs/testing/helpers/)

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)

[Storybook](https://storybook.js.org/)

### Testing

```bash
yarn web-test-runner
# OR
yarn wtr
```

### Previewing

We use Storybook stories for our components to allow for documentation as
well as understanding as to how to use a component and preview a nice
preview.

```bash
yarn storybook
```

This will open up your browser and let you view our web components.

### Development

Maybe you dont have a storybook story yet and youre still working on
your component, you can preview by using `@web/dev-server` with the following command:

```bash
# We will most likely make an easy to use script for this to cut
# down on typing.

yarn wds --app-index
app/javascript/components/<component-name>/demo/index.html
```

### Making a new component

I will be making a generator for this. To get this example took a lot of
custom effort so it seems best to make my own template for this rather
than keep it as a manual effort.
