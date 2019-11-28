// ==============================================
// Fichier XSL de transformation texte XML
// ==============================================
	// On crée le fichier xslt
		xsltForTexteXml = 		'<?xml version="1.0" encoding="ISO-8859-1"?>';
		xsltForTexteXml +=		'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">';
		xsltForTexteXml +=		'<xsl:output encoding="UTF-8" method="xml"/>';
		xsltForTexteXml +=		'<xsl:template match="text()">';
		xsltForTexteXml +=		'<xsl:value-of select="translate(., \'&#10;&#13;\',\'\')"/>';
		xsltForTexteXml +=		'</xsl:template>';
		// Template PRINCIPAL
		xsltForTexteXml +=		'	<xsl:template match="/transcript">';
		xsltForTexteXml +=		'		<div class="textXml">';
		// xsltForTexteXml +=		'			<xsl:apply-templates select="x-entete"/>';
		// xsltForTexteXml +=		'			<xsl:apply-templates select=".//x-enmarge"/>';
		// xsltForTexteXml +=		'			<xsl:apply-templates select="x-ensignature"/>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</div>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-entete
		xsltForTexteXml +=		'	<xsl:template match="x-entete">';
		xsltForTexteXml +=		'		<div class="entete">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</div>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-enmarge
		xsltForTexteXml +=		'	<xsl:template match="x-enmarge">';
		xsltForTexteXml +=		'		<div class="enmarge">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</div>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-ensignature
		xsltForTexteXml +=		'	<xsl:template match="x-ensignature">';
		xsltForTexteXml +=		'		<div class="ensignature">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</div>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-incertain
		xsltForTexteXml +=		'	<xsl:template match="x-incertain">';
		xsltForTexteXml +=		'		<span class="incertain" title="Donnée incertaine">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</span>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-ennote
		xsltForTexteXml +=		'	<xsl:template match="x-ennote">';
		xsltForTexteXml +=		'		<div class="ennote">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</div>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-img
		xsltForTexteXml +=		'	<xsl:template match="x-img">';
		xsltForTexteXml +=		'		<img>';
		xsltForTexteXml +=		'			<xsl:attribute name="src">' + Meteor.absoluteUrl() + "marais" + '<xsl:value-of select="./@src"/></xsl:attribute>';
		xsltForTexteXml +=		'			<xsl:attribute name="class"><xsl:value-of select="./@align"/> img-responsive</xsl:attribute>';
		
		xsltForTexteXml +=		'		</img>';
		xsltForTexteXml +=		'	</xsl:template>';
		// --------------------------------------------------------
		// Template x-pers
		xsltForTexteXml +=		'	<xsl:template match="x-pers">';
		xsltForTexteXml +=		'		<a>';
		xsltForTexteXml +=		'			<xsl:choose>';
		xsltForTexteXml +=		'		  		<xsl:when test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir cette personne (lien_incertain)</xsl:attribute>';
		xsltForTexteXml +=		'		 		</xsl:when>';
		xsltForTexteXml +=		'		  		<xsl:otherwise>';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir cette personne</xsl:attribute>';
		xsltForTexteXml +=		'		  		</xsl:otherwise>';
		xsltForTexteXml +=		'			</xsl:choose>';
		xsltForTexteXml +=		'			<xsl:attribute name="href">/pers/infos/<xsl:value-of select="./@id"/></xsl:attribute>';
		xsltForTexteXml +=		'			<xsl:if test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'				<xsl:attribute name="class">lien_incertain</xsl:attribute>';
		xsltForTexteXml +=		'			</xsl:if>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</a>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-lieu
		xsltForTexteXml +=		'	<xsl:template match="x-lieu">';
		xsltForTexteXml +=		'		<a>';
		xsltForTexteXml +=		'			<xsl:choose>';
		xsltForTexteXml +=		'		  		<xsl:when test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce lieu (lien_incertain)</xsl:attribute>';
		xsltForTexteXml +=		'		 		</xsl:when>';
		xsltForTexteXml +=		'		  		<xsl:otherwise>';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce lieu</xsl:attribute>';
		xsltForTexteXml +=		'		  		</xsl:otherwise>';
		xsltForTexteXml +=		'			</xsl:choose>';
		xsltForTexteXml +=		'			<xsl:attribute name="href">/lieu/infos/<xsl:value-of select="./@id"/></xsl:attribute>';
		xsltForTexteXml +=		'			<xsl:if test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'				<xsl:attribute name="class">lien_incertain</xsl:attribute>';
		xsltForTexteXml +=		'			</xsl:if>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</a>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-hist
		xsltForTexteXml +=		'	<xsl:template match="x-hist">';
		xsltForTexteXml +=		'		<a>';
		xsltForTexteXml +=		'			<xsl:choose>';
		xsltForTexteXml +=		'		  		<xsl:when test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce point d\'histoire (lien_incertain)</xsl:attribute>';
		xsltForTexteXml +=		'		 		</xsl:when>';
		xsltForTexteXml +=		'		  		<xsl:otherwise>';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce point d\'histoire</xsl:attribute>';
		xsltForTexteXml +=		'		  		</xsl:otherwise>';
		xsltForTexteXml +=		'			</xsl:choose>';
		xsltForTexteXml +=		'			<xsl:attribute name="href">/hist/infos/<xsl:value-of select="./@id"/></xsl:attribute>';
		xsltForTexteXml +=		'			<xsl:if test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'				<xsl:attribute name="class">lien_incertain</xsl:attribute>';
		xsltForTexteXml +=		'			</xsl:if>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</a>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template x-doc
		xsltForTexteXml +=		'	<xsl:template match="x-doc">';
		xsltForTexteXml +=		'		<a>';
		xsltForTexteXml +=		'			<xsl:choose>';
		xsltForTexteXml +=		'		  		<xsl:when test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce document (lien_incertain)</xsl:attribute>';
		xsltForTexteXml +=		'		 		</xsl:when>';
		xsltForTexteXml +=		'		  		<xsl:otherwise>';
		xsltForTexteXml +=		'		    		<xsl:attribute name="title">Voir ce document</xsl:attribute>';
		xsltForTexteXml +=		'		  		</xsl:otherwise>';
		xsltForTexteXml +=		'			</xsl:choose>';
		xsltForTexteXml +=		'			<xsl:attribute name="href">/doc/infos/<xsl:value-of select="./@id"/></xsl:attribute>';
		xsltForTexteXml +=		'			<xsl:if test="@incertain = \'incertain\'">';
		xsltForTexteXml +=		'				<xsl:attribute name="class">lien_incertain</xsl:attribute>';
		xsltForTexteXml +=		'			</xsl:if>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</a>';
		xsltForTexteXml +=		'	</xsl:template>';
		// --------------------------------------------------------
		// Template ul
		xsltForTexteXml +=		'	<xsl:template match="ul">';
		xsltForTexteXml +=		'		<ul>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</ul>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template li
		xsltForTexteXml +=		'	<xsl:template match="li">';
		xsltForTexteXml +=		'		<li>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</li>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template p
		xsltForTexteXml +=		'	<xsl:template match="p">';
		xsltForTexteXml +=		'		<p>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</p>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template br
		xsltForTexteXml +=		'	<xsl:template match="br">';
		xsltForTexteXml +=		'		<br/>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template hr
		xsltForTexteXml +=		'	<xsl:template match="hr">';
		xsltForTexteXml +=		'		<hr/>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template i
		xsltForTexteXml +=		'	<xsl:template match="i">';
		xsltForTexteXml +=		'		<i>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</i>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template b
		xsltForTexteXml +=		'	<xsl:template match="b">';
		xsltForTexteXml +=		'		<b>';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</b>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template h1
		xsltForTexteXml +=		'	<xsl:template match="h1">';
		xsltForTexteXml +=		'		<h1 class="transcript">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</h1>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template h2
		xsltForTexteXml +=		'	<xsl:template match="h2">';
		xsltForTexteXml +=		'		<h2 class="transcript">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</h2>';
		xsltForTexteXml +=		'	</xsl:template>';
		// Template h3
		xsltForTexteXml +=		'	<xsl:template match="h3">';
		xsltForTexteXml +=		'		<h3 class="transcript">';
		xsltForTexteXml +=		'			<xsl:apply-templates/>';
		xsltForTexteXml +=		'		</h3>';
		xsltForTexteXml +=		'	</xsl:template>';
		// --------------------------------------------------------
		xsltForTexteXml +=		'</xsl:stylesheet>';