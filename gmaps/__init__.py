VERSION = (0, 2)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-05-28"
try:
    from . import conf
except:
    pass