---
title: People
nav:
  order: 3
---

# {% include icon.html icon="fa-solid fa-users" %}People

{% include list.html data="members" component="portrait" filter="role == 'pi'" %}
{% include list.html data="members" component="portrait" filter="role == 'postoc'" %}
{% include list.html data="members" component="portrait" filter="role == 'phd'" %}
{% include list.html data="members" component="portrait" filter="role == 'postgrad'" %}
{% include list.html data="members" component="portrait" filter="role == 'undergrad'" %}

