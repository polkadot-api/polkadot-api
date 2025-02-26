export function generateIndex({ networks }: { networks: string[] }): string {
  return baseHtml({
    networks,
    readme: readme(),
  })
}

function networkLink({ name }: { name: string }): string {
  return `<a href="./${name}"><span>${name}</span></a>`
}

function baseHtml({
  readme,
  networks,
}: {
  readme: string
  networks: string[]
}): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>PAPI Chain Docs</title>
    <meta name="description" content="Documentation for PAPI Chain Docs">
    <style>${getStyle()}</style>
  </head>
  <body>
    <div class="container-main">
      <div class="container-sidebar">
        <h3>Networks:</h3>
        <ul>
          ${networks.map((network) => `<li>${networkLink({ name: network })}</li>`).join("\n")}
        </ul>
      </div>
      <div class="container-content">${readme}</div>
    </div>
  </body>
  </html>`
}

function readme(): string {
  return `
<h1>PAPI Chain Docs</h1>
<p>This is generated documentation for some well-known chains. It's based on chain metadata, and unique to specific chain. </p>
<p>We aim to support all relay chains and their system chains. </p>
<p>With these docs, you can search for apis like 
<code class="code-snippet-inline">limited_teleport_assets</code>, 
their type parameters, and the docs that metadata provide for them.
</p>
<p>You can also generate such documentation for any chain, 
using <code class="code-snippet-inline">papi-generate-docs</code> binary, 
provided by <code class="code-snippet-inline">@polkadot-api/docgen</code> 
package:</p>
<p>
  <pre class="code-snippet-big">
    <code>
npm install polkadot-api @polkadot-api/docgen
papi add &lt;...&gt;
papi-generate-docs --config &lt;path-to-papi-config&gt; --output &lt;docs_directory&gt;</code>
  </pre>
</p>
<p>Note that this information might update a bit late after a runtime upgrade, since the docs are staticly generated once a day.</p>
<p>See <a href="https://papi.how" target="_blank" class="external">papi.how</a> for general Polkadot-API documentation.</p>
<p>Happy hacking!</p>
</div>
  `
}

// a no-op tag function allows for IDE syntax highlighting of the contents
function css(strings: TemplateStringsArray, ...values: string[]): string {
  return strings.reduce(
    (res, str, index) => `${res}${str}${values[index] ?? ""}`,
  )
}

function getStyle(): string {
  return css`
    body {
      background: #f2f4f8;
      font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica,
        Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 16px;
    }

    .container-main {
      display: grid;
      grid-template-columns: minmax(0, 300px) minmax(0, auto);
      grid-template-areas: "sidebar content";
      margin: 2rem auto;
    }

    .container-sidebar {
      grid-area: sidebar;
      max-height: calc(100vh - 2rem - 42px);
      overflow: auto;
      position: sticky;
      padding: 1rem;
    }

    a {
      color: #1f70c2;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    li {
      list-style-type: "🌐";
      padding: 5px 2px;
    }

    .code-snippet-inline {
      background: #ffffff;
      border-radius: 0.8em;
      padding: 0.2em;
    }

    .code-snippet-big {
      background: #ffffff;
      border: 1px solid #c5c7c9;
      border-radius: 0.8em;
      padding-left: 1.3em;
      padding-right: 1.3em;
      width: max-content;
    }
  `
}
