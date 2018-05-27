import {VisTypesRegistryProvider} from 'ui/registry/vis_types';
import {TemplateVisTypeProvider} from 'ui/template_vis_type/template_vis_type';
import {VisVisTypeProvider} from 'ui/vis/vis_type';

import template from './image-display.html';
import editor from './image-display-params.html';
import './image-display.css';

import './image-display-controller'


VisTypesRegistryProvider.register(ImageDisplayVizType);

function ImageDisplayVizType(Private) {
  const TemplateVisType = Private(TemplateVisTypeProvider);

  return new TemplateVisType({
    name: 'image-display',
    title: 'Image Display',
    description: 'Display images found in record attributes',
    icon: 'fa-image',
    category: Private(VisVisTypeProvider).CATEGORY.OTHER,
    template: template,
    params: {
      editor: editor
    },
    requiresSearch: false,
  });
}

export default ImageDisplayVizType;
