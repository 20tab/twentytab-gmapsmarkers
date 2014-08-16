VERSION = (0, 12)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-08-16"
try:
    from . import conf
except:
    pass
