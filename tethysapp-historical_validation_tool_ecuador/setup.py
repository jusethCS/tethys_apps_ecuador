from setuptools import setup, find_namespace_packages
from tethys_apps.app_installation import find_all_resource_files
from tethys_apps.base.app_base import TethysAppBase

# -- Apps Definition -- #
app_package = 'historical_validation_tool_ecuador'
release_package = f'{TethysAppBase.package_namespace}-{app_package}'

# -- Python Dependencies -- #
dependencies = []

# -- Get Resource File -- #
resource_files = find_all_resource_files(app_package, TethysAppBase.package_namespace)


setup(
    name=release_package,
    version='0.0.1',
    description='This app combines the observed data and the simulated data from the GEOGloWS ECMWF Streaamflow Services in Ecuador.',
    long_description='',
    keywords='',
    author='Juseth E. Chancay',
    author_email='juseth.chancay@gmail.com',
    url='',
    license='',
    packages=find_namespace_packages(),
    package_data={'': resource_files},
    include_package_data=True,
    zip_safe=False,
    install_requires=dependencies,
)