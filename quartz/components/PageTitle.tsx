import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <img src={`${baseDir}static/assets/brand/logo-header.png`} alt="cavegeek.ai logo" class="logo" />
        <span class="title-text">{title}</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.page-title a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.page-title .logo {
  height: 60px;
  width: auto;
}

.page-title .title-text {
  color: var(--dark);
  font-weight: 600;
}

.page-title a:hover .title-text {
  color: var(--secondary);
  transition: color 0.2s ease;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
