describe('Onixjs', function(){
  var expect = chai.expect;
  describe('Element Creation', function(){

    it('should create a empty DOM element', function(){
      var example   = '<div></div>',
          div       = onix.div,
          element;

      element = div().outerHTML;
      expect(element).to.equal(example);
    });

    it('should create a DOM element with attributes', function(){
      var example   = '<div class="test"></div>',
          div       = onix.div,
          element;

      element = div({'class': 'test'}).outerHTML;
      expect(element).to.equal(example);
    });

    it('should create a DOM element with content', function(){
      var example   = '<div>test</div>',
          div       = onix.div,
          element;

      element = div('test').outerHTML;
      expect(element).to.equal(example);
    });

    it('should create a DOM element with attributes and content', function(){
      var example  = '<div class="ctest">test</div>',
          div       = onix.div,
          element;

      element = div({'class': 'ctest'},
                  'test'
                ).outerHTML;
      expect(element).to.equal(example);
    });

    it('should create a DOM element with other DOM elements nested', function(){
      var example   = '<div><span>test</span><ul class="ctest"></ul></div>',
          div       = onix.div,
          span      = onix.span,
          ul        = onix.ul,
          element;

      element =
        div(
          span('test'),
          ul({'class': 'ctest'})
        ).outerHTML;

      expect(element).to.equal(example);
    });
  });

  describe('Templating Options', function(){
    it('should be able to save and reuse a template', function(){
      var example   = '<div>test</div>',
          div       = onix.div,
          element;

      element = div('test');
      onix.register('test', element);

      expect(onix.template('test').outerHTML).to.equal(example);
    });

    it('should return a strigify version of the template', function(){
      var example  = '<div>test</div>',
          div       = onix.div,
          element;

      element = div('test');
      onix.register('test', element);

      expect(onix.render('test')).to.equal(example);
    }),

    it('should be able to nest saved templates', function(){
      var example   = '<div>test<div class="ctest"></div></div>',
          div       = onix.div,
          register  = onix.register,
          render    = onix.render,
          template  = onix.template,
          parent, child;

      child = div({'class':'ctest'});
      register('child', child);

      parent = div('test', template('child'));

      expect(render(parent)).to.equal(example);
    });
  });

  describe('General behaviors', function(){

    it('should have all methods presented in "onix.tags"', function(){
      expect(onix).to.contain.keys(onix.tags);
    });

    it('should be able to add new function tags', function(){
      onix.tags.push('test');
      onix.updateTags();
      expect(onix).to.contain.keys('test');
    });

    it('should be able to use new function tags', function(){
      var example   = '<test></test>',
          element, test;

      onix.tags.push('test');
      onix.updateTags();

      test = onix.test;
      element = test().outerHTML;

      expect(element).to.equal(example);
    });
  });
});