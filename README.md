Seismic-Eruptions
=================

Link to the developing project page : http://gizmoabhinav.github.io/Seismic-Eruptions

=================

This is a project under Concord Consortium

project details: http://concord.org/GSoC-2014#project-4

=================

This is a mobile friendly web application which shows Earthquake activities from around the world on a timeline. The application queries for earthquake information from USGS databse.

The application has two major parts:

1. The 2D timeline view

2. The 3D cross-section view

The date ranges of the earthquake shown are user-customizable along with the cutoff earthquake magnitude. The default date range for the 2D timeline view is between 1-1-2009 and today with the magnitude cutoff set to 5.

The user has options to speed up, speed down, play and pause the time, show/hide the plate boundaries and select different date ranges and magnitude cutoffs. Selecting different date ranges and magnitude cutoffs can be done by using the UI or by giving parameters in the URL. The date selector calculates the magnitude range to accomodate optimum number of earthquake events.

The parameters accepted by the 2D timeline view are:

mag (for cutoff magnitude), startdate and enddate

example URL : http://gizmoabhinav.github.io/Seismic-Eruptions/?startdate=2013-1-1&enddate2014-1-1&mag=3

The 2D view has an option for creating a cross section on the map which can be viewed in the 3D cross-section view. The earthquake are shown at the depths of their epicenters inside the area selected in the cross section.

example for 3D view : http://gizmoabhinav.github.io/Seismic-Eruptions/3D/index.html?x1=-150.93692718692023&y1=59.0055756238412&x2=-155.17764984317023&y2=59.85482492869055&x3=-155.38374874588203&y3=59.590945996856505&x4=-151.14302608963203&y4=58.73500026000132&mag=3&startdate=2009-1-1&enddate=2014-1-1


