VERSION = (0, 9)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-06-04"
try:
    from . import conf
except:
    pass