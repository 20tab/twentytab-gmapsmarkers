from setuptools import setup, find_packages
import gmaps

setup(
    name='twentytab-gmaps',
    version=gmaps.__version__,
    description='A django widget with Select2 integration that uses google geocode api to search places and create maps with markers',
    author='20tab S.r.l.',
    author_email='info@20tab.com',
    url='https://github.com/20tab/twentytab-gmaps',
    license='MIT License',
    install_requires=[
        'Django >=1.6',
        'django-appconf>=0.6',
    ],
    packages=find_packages(),
    include_package_data=True,
    package_data={
        '': ['*.html', '*.css', '*.js', '*.gif', '*.png', ],
}
)
