---
title: Projects
nav:
  order: 2
  tooltip: Software, datasets, and more
---

# {% include icon.html icon="fa-solid fa-wrench" %}Projects
{: .center}

Check out our ongoing projects, softwares, and datasets.
{: .center}

{% include tags.html tags="publication, resource" %}

{% include search-info.html %}

{% include section.html %}

{% comment %}
  all projects, newest first, by the internal `date` field (not rendered).
  list.html is not used here because it adds year headings when dates are present.
{% endcomment %}
{% assign projects = site.data.projects | sort: "date" | reverse %}
{% for project in projects %}
  {%
    include card.html
    title=project.title
    subtitle=project.subtitle
    image=project.image
    link=project.link
    description=project.description
    tags=project.tags
    repo=project.repo
  %}
{% endfor %}
