VERSION = (0, 14)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-10-30"
try:
    from . import conf
except ImportError:
    pass
