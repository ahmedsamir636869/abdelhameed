(() => {
  const isExtensionAttribute = (name) =>
    name.startsWith('bis_') ||
    (name.startsWith('__processed_') && name.endsWith('__'));

  const clean = (node) => {
    if (!(node instanceof Element)) return;

    for (const attribute of [...node.attributes]) {
      if (isExtensionAttribute(attribute.name)) node.removeAttribute(attribute.name);
    }

    node.querySelectorAll('*').forEach((child) => {
      for (const attribute of [...child.attributes]) {
        if (isExtensionAttribute(attribute.name)) child.removeAttribute(attribute.name);
      }
    });
  };

  clean(document.documentElement);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && isExtensionAttribute(mutation.attributeName || '')) {
        clean(mutation.target);
      }

      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(clean);
      }
    }
  }).observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
