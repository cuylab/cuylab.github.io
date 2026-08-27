---
title: People
nav:
  order: 3
---

# {% include icon.html icon="fa-solid fa-users" %}People

{% include list.html data="members" component="portrait" filter="role == 'principal-investigator'" %}
{% include list.html data="members" component="portrait" filter="role == 'postdoc'" %}
{% include list.html data="members" component="portrait" filter="role == 'phd'" %}
{% include list.html data="members" component="portrait" filter="role == 'postgrad'" %}
{% include list.html data="members" component="portrait" filter="role == 'undergrad'" %}
{% include list.html data="members" component="portrait" filter="role == 'placeholder'" %}

