'use strict';
/*jshint node:true, quotmark:false*/
/*global app,$*/

app.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
				element.next().focus();
			}
		});
	};
});
app.directive('clickAndDisable', function () {
	return {
		scope: {
			clickAndDisable: '&'
		},
		link: function (scope, iElement) {
			iElement.bind('click', function () {
				iElement.prop('disabled', true);
				scope.clickAndDisable().finally(function () {
					iElement.prop('disabled', false);
				});
			});
		}
	};
});



app.directive('modal', function () {
	return {
		template: '<div class="modal fade">' +
			'<div class="modal-dialog">' +
			'<div class="modal-content">' +
			'<div class="modal-header"  ng-if="title">' +
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" >&times;</button>' +
			'<h4 class="modal-title" align="center" style="font-weight: bold;" ng-if="title">{{ title }}</h4>' +
			'</div>' +
			'<div class="modal-body" ng-transclude></div>' +
			'</div>' +
			'</div>' +
			'</div>',
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: true,
		link: function postLink(scope, element, attrs) {
			scope.title = attrs.title;

			scope.$watch(attrs.visible, function (value) {
				if (value === true) {
					$(element).modal('show');
				} else {
					$(element).modal('hide');
				}
			});

			$(element).on('shown.bs.modal', function () {
				scope.$apply(function () {
					scope.$parent[attrs.visible] = true;
					$(".modal-backdrop").remove();

				});
			});

			$(element).on('hidden.bs.modal', function () {
				scope.$apply(function () {
					scope.$parent[attrs.visible] = false;
				});
			});

		}
	};
});

app.directive('emailValidation', function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ngModel) {

			ngModel.$parsers.unshift(function (value) {

				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				var valid = re.test(value);
				ngModel.$setValidity('email', valid);
				return valid ? value : undefined;
			});

		}
	};
});
app.directive('phoneValidation', function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ngModel) {

			ngModel.$parsers.unshift(function (value) {

				var re = /^((0[0-9]{10})|([1-9][0-9]{9})|(\+[0-9]{1,3}[0-9]{10})){1}$/;
				var valid = re.test(value);
				ngModel.$setValidity('email', valid);
				return valid ? value : undefined;
			});

		}
	};
});
